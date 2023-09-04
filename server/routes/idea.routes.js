const IdeaController = require("../controllers/idea.controller")

module.exports = app => {
    app.get('/api/ideas', IdeaController.findAllIdeas)
    app.get('/api/ideas/:id', IdeaController.findOneIdea)
    app.post('/api/ideas', IdeaController.createIdea)
    app.post('/api/ideas/:id/favorite', IdeaController.favorite)
    app.post('/api/ideas/:id/unfavorite', IdeaController.unfavorite)
    app.delete('/api/ideas/:id', IdeaController.deleteIdea)
}