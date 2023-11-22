import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import ACTIONS from '../Actions.js';
import connectDB from './config/db.js'
import userRouter from './routes/userRoutes.js'
import notFound from './routes/errMiddleware/notFound.js';
import errorHandler from './routes/errMiddleware/errorHandler.js';

dotenv.config();
connectDB();
const app = express();

app.use(express.json());

const server = createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 4500;

const userSocketMap = {};

app.get('/', (req, res) => {
    res.send("API is running ");
})

app.use('/api/user', userRouter)
app.use(notFound);
app.use(errorHandler);

const getAllConnectedClient = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId],
        }
    });
}

io.on('connection', (socket) => {
    console.log('Socket connected', socket.id)

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClient(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients, username, socketId: socket.id
            })
        })
    })

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    })

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    })

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            })
        })
        delete userSocketMap[socket.id];
        socket.leave();
    })
})

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})

