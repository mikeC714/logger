export const WsHandlers = {
	handleDisconnect: async(redis:any, projectKey:string) => {
		await redis.xgroup(
			"DESTROY",
			`stream:${projectKey}`,
			`${projectKey}-grp`
		)
		await redis.del(`stream:${projectKey}`)
	},
}
