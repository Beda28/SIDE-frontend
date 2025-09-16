import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function TerminalComponent() {
  const terminalRef = useRef();

  useEffect(() => {
    const term = new Terminal({ cursorBlink: true });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    // 샘플 출력
    term.writeln("test");

    // WebSocket 연결 
    // const socket = new WebSocket("ws://localhost:8000/ws/terminal/1234");
    // term.onData((data) => socket.send(data));
    // socket.onmessage = (event) => term.write(event.data);

    return () => term.dispose();
  }, []);

  return <div ref={terminalRef} style={{ width: "100%", height: "100%" }} />;
}
