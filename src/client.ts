import * as io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";

import { ISendMsg } from "./global";

const input: HTMLInputElement = <HTMLInputElement>document.getElementById("name");
const message: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById("message");
const send: HTMLButtonElement = <HTMLButtonElement>document.getElementById("send");
const messages: HTMLDivElement = <HTMLDivElement>document.getElementById("messages");

const socket: SocketIOClient.Socket = io();

(async () => {
    const res = await fetch("http://localhost:3000/messages");
    const data: ISendMsg[] = await res.json();
    data.forEach(addMessages);
})();

send.addEventListener("click", () => {
    socket.emit("message", { name: input.value, message: message.value });
});

socket.on("message", addMessages)

function addMessages({ name, message }: ISendMsg) {
    messages.insertAdjacentHTML("beforeend", `
        <h4> ${name} </h4>
        <p>  ${message} </p>
    `);
}
