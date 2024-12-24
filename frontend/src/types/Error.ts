export interface Error {
	msg: string,
	field: string
}

export interface ErrorResponse {
	error: [Error]
}
