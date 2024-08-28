import { Conn } from "./conn";

const _conn = new Conn();

export function useConn() : Conn
{
	return _conn;
}