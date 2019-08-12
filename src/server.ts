import * as express from "express";
import * as http from "http";
import * as net from "net";
import * as socketio from "socket.io";
import * as mongoose from "mongoose";

import { ISendMsg } from "./global";

interface ISendMsgModel extends mongoose.Document, ISendMsg {}

const app: express.Express = express();
const server: http.Server = http.createServer(app);
const io: socketio.Server = socketio(server);

let Message: mongoose.Model<ISendMsgModel>;

(async () => {
    try {
        await mongoose.connect("mongodb://localhost/simple-chat");
        Message = mongoose.model<ISendMsgModel>("Message", new mongoose.Schema({ name: String, message: String }))
    } catch (err) {
        console.log(err)
    }
})();

app.use(express.static(`${__dirname}/../`));

app.get("/messages", async (req: express.Request, res: express.Response) => {
    try {
        const messages = await Message.find({});
        res.send(messages);
    } catch (err) {
        console.log(err)
    }
})

io.on("connection", (socket: socketio.Socket) => {
    socket.on("message", async (msg: ISendMsg) => {
        try {
            const message = new Message(msg);
            await message.save();
            io.emit("message", msg);
        } catch (err) {
            console.log(err)
        }
    });
})

server.listen(3000, () => {
    console.log(`server is running on port ${(server.address() as net.AddressInfo).port}`);
});
