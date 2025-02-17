import express, { request, response } from 'express';
import cors from 'cors';
import { prismaClient } from './prisma_client/index.js';

const app = express();

app.use(express.json());
app.use(cors());

app.get("/task", async(request, response) => {
    try {   
        const tasks = await prismaClient.task.findMany();

        return response.status(200).send({ task : tasks});
    } catch (err) {
        throw new Error(`Falha ao buscar as taks ${err}`);
    }
})

app.get("/task/:id", async(request, response) => {
    try {
        const id = Number(request.params.id);

        const task = await prismaClient.task.findUnique({
            where: {
                id
            }
        });

        if(task != null){
            return response.status(200).send({task : task});
        }

        return response.status(404).send({message : "Erro ao encontrar a task" });

    } catch (err) {
        throw new Error(`Falha ao buscar as taks ${err}`);
    }
})

app.post("/task", async (request, response) => {
    try {
        const {title, description, finish} = request.body;

        const createTask = await prismaClient.task.create({
            data : {
                title,
                description,
                finish
            }
        });

        response.status(201).send({taks : createTask});
        
    } catch (err) {
        throw new Error(`Falha ao enviar tarefa: erro ${err}`)
    }
})

app.patch("/task/:id", async(request, response) => {
    try {
        const { title, description, finish } = request.body;
        const id = Number(request.params.id);


        const verificationEditedTask = await prismaClient.task.findUnique({
            where : {
                id
            }
        });

        if(verificationEditedTask != null){
            const editedTaks = await prismaClient.task.update({
                where: {
                    id
                },
                data: {
                    title,
                    description,
                    finish
                }
            })

            return response.status(200).send({editedTaks : editedTaks});
        }

        response.status(404).send("Taks não encontrada");
    } catch (error) {
        throw new Error(`Erro ao atualizar a task ${error}`);
    }
})

app.delete("/task/:id", async (request, response) => {
    try {
        const id = Number(request.params.id);

        const taskDelete = await prismaClient.task.delete({
            where: {
                id
            }
        })

        return response.status(202).send({taskDelete : taskDelete})
        
    } catch (error) {
        response.status(500).send({ mensage : "Erro ao encontrar a task" })
    }
})

// Create port 
app.listen(3001, () => {
    console.log("Sucessfull, port 3001")
});
