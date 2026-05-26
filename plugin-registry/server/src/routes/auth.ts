import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../db/index.js';
import { randomBytes } from 'crypto';

const GitHubTokenSchema = z.object({
	code: z.string(),
});

export async function authRoutes(fastify: FastifyInstance) {
	fastify.post('/auth/github', async (request, reply) => {
		try {
			const { code } = GitHubTokenSchema.parse(request.body);

			console.log('🔐 Starting GitHub OAuth flow...');

			// Exchange code for access token
			const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					client_id: process.env.GITHUB_CLIENT_ID,
					client_secret: process.env.GITHUB_CLIENT_SECRET,
					code,
				}),
			});

			const tokenData = (await tokenRes.json()) as { access_token?: string; error?: string; error_description?: string };
			
			if (!tokenData.access_token) {
				console.error('❌ GitHub token exchange failed:', tokenData.error, tokenData.error_description);
				return reply.code(401).send({ error: 'GitHub OAuth failed', details: tokenData.error_description });
			}

			console.log('✅ Got access token from GitHub');

			// Get user info from GitHub
			const userRes = await fetch('https://api.github.com/user', {
				headers: { Authorization: `Bearer ${tokenData.access_token}` },
			});

			if (!userRes.ok) {
				console.error('❌ Failed to fetch user from GitHub:', userRes.status, userRes.statusText);
				return reply.code(500).send({ error: 'Failed to get user info from GitHub' });
			}

			const githubUser = (await userRes.json()) as {
				id: number;
				login?: string;
				email?: string | null;
				avatar_url?: string;
			};

			console.log('👤 GitHub user:', { id: githubUser.id, login: githubUser.login });

			// Validate GitHub user data
			if (!githubUser.id || !githubUser.login) {
				console.error('❌ Invalid GitHub user data:', githubUser);
				return reply.code(500).send({ error: 'Failed to get user info from GitHub - missing id or login' });
			}

			// Check if user exists
			const existing = db
				.prepare('SELECT * FROM users WHERE github_id = ?')
				.get(String(githubUser.id)) as { id: string; username: string; email: string; avatar: string } | undefined;

			let user;
			if (existing) {
				console.log('✅ Existing user found:', existing.username);
				user = existing;
			} else {
				const userId = randomBytes(16).toString('hex');
				console.log('➕ Creating new user:', githubUser.login);
				
				try {
					db.prepare(
						'INSERT INTO users (id, username, email, github_id, avatar) VALUES (?, ?, ?, ?, ?)'
					).run(
						userId,
						githubUser.login,
						githubUser.email || '',
						String(githubUser.id),
						githubUser.avatar_url || ''
					);
					user = {
						id: userId,
						username: githubUser.login,
						email: githubUser.email || '',
						avatar: githubUser.avatar_url || ''
					};
					console.log('✅ User created successfully');
				} catch (dbError: any) {
					console.error('❌ Database error creating user:', dbError.message);
					return reply.code(500).send({ error: 'Failed to create user', details: dbError.message });
				}
			}

			// Generate JWT token
			const token = fastify.jwt.sign({ userId: user.id, username: user.username });

			// Check if user is admin
			const adminUsernames = (process.env.ADMIN_GITHUB_USERNAMES || '')
				.split(',')
				.map(u => u.trim())
				.filter(Boolean);
			
			const isAdmin = adminUsernames.includes(user.username);
			
			console.log('🔑 Admin check:', {
				username: user.username,
				adminList: adminUsernames,
				isAdmin
			});

			console.log('✅ Auth successful for:', user.username);
			
			return { 
				token, 
				user: {
					...user,
					isAdmin
				}
			};
		} catch (error: any) {
			console.error('❌ Auth error:', error.message, error.stack);
			return reply.code(500).send({ error: 'Authentication failed', details: error.message });
		}
	});

	fastify.get('/auth/me', { onRequest: [fastify.authenticate] }, async (request) => {
		const userId = (request.user as { userId: string; username: string }).userId;
		const username = (request.user as { userId: string; username: string }).username;
		const user = db.prepare('SELECT id, username, email, avatar, created_at FROM users WHERE id = ?').get(userId) as any;
		
		// Check if user is admin
		const adminUsernames = (process.env.ADMIN_GITHUB_USERNAMES || '')
			.split(',')
			.map(u => u.trim())
			.filter(Boolean);
		
		return {
			...user,
			isAdmin: adminUsernames.includes(username)
		};
	});
}
