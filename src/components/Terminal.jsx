import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { useParams } from "react-router-dom"
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const TerminalComponent = (start) => {
  const { id } = useParams();
  const terminalRef = useRef();
  const term = new Terminal({ cursorBlink: true });

  useEffect(() => {
    if (start.start){
      const socket = new WebSocket(`ws://localhost:4184/api/ws/terminal/${id}`);
      socket.onmessage = (event) => {term.writeln(event.data); console.log(event.data)};
    }
  }, [start])

  useEffect(() => {
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    // 샘플 출력
    // term.writeln("test");

    // WebSocket 연결 
    // const socket = new WebSocket(`ws://localhost:4184/api/ide/terminal/${id}`);
    // socket.onmessage = (event) => {term.write(event.data); console.log(event.data)};
    // term.onData((data) => socket.send(data));  // 터미널 제작시 사용

    return () => term.dispose();
  }, []);

  return <div ref={terminalRef} style={{ width: "100%", height: "100%" }} />;
}

export default TerminalComponent;