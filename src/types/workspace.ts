export interface WorkspaceConfig {
	name: string;
	model: string;
	profile: string;
}

export const DEFAULT_WORKSPACE: WorkspaceConfig = {
	name: 'No workspace loaded',
	model: 'No model selected',
	profile: 'Default',
};
