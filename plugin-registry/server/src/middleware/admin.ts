import { FastifyRequest, FastifyReply } from 'fastify';

export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
	const adminUsernames = (process.env.ADMIN_GITHUB_USERNAMES || '')
		.split(',')
		.map(u => u.trim())
		.filter(Boolean);

	if (adminUsernames.length === 0) {
		return reply.code(500).send({ error: 'No admins configured' });
	}

	const user = request.user as { userId: string; username: string } | undefined;

	if (!user || !adminUsernames.includes(user.username)) {
		return reply.code(403).send({ error: 'Admin access required' });
	}
}
