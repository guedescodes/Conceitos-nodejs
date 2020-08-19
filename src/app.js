const express = require("express");
const cors = require("cors");

const { v4: uuid, v4: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validationId)

const repositories = [];

function validationId(request,response,next){
  const {id} = request.params;
  if(!isUuid(id)){
    return response.status(400).json({error: "Id Incorrect."});
  }
  next()
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title,url,techs} = request.body;
  const repository = {id: uuid(),title: title,url:url,techs:techs,likes:0} 
  console.log(title);
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title,url,techs} = request.body;
  const repository = repositories.find(repo => repo.id == id);
  console.log(repository);
  if(repository == undefined)
  {
    return response.status(400).json({error: "Repository not localized."})
  }
   repository.title = title ? title : repository.title;
   repository.url = url ? url : repository.url;
   repository.techs = techs ? techs : repository.techs;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repoIndex = repositories.findIndex(repo => repo.id ==id);
  if(repoIndex < 0)
  {
    return response.status(400).json({error: "Repository not localized."})
  }

  repositories.splice(repoIndex,1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const repository = repositories.find(repo => repo.id == id);
  if(repository == undefined)
  {
    return response.status(400).json({error: "Repository not localized."})
  }
  repository.likes += 1;
  return response.json(repository);
});

module.exports = app;
