const moment = require('moment')

module.exports = app => {
    const getTasks = (req, res) => {
        const date = req.query.date
            ? req.query.date
            : moment().endOf('day').toDate()

        app.db('tasks')
            .where({ userId: req.user.id })
            .where('estimateAt', '<=', date)
            .orderBy('estimateAt')
            .then(tasks => res.json(tasks))
            .catch(err => res.status(500).json(err))
    }

    const save = (req, res) => {
        if (!req.body.desc.trim()) {
            return res.status(400).send('Description is a required field')
        }

        req.body.userId = req.user.id

        app.db('tasks')
            .insert(req.body)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).json(err))
    }

    const remove = (req, res) => {
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .del()
            .then(rowsDeleted => {
                if (rowsDeleted > 0) {
                    res.status(204).send()
                } else {
                    const message = `Task not found with id ${req.params.id}.`
                    res.status(400).send(message)
                }
            })
            .catch(err => res.status(500).json(err))
    }

    const updateTaskDoneAt = (req, res, doneAt) => {
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .update({ doneAt })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).json(err))
    }

    const toggleTask = (req, res) => {
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .first()
            .then(task => {
                if (!task) {
                    const message = `Task not found with id ${req.params.id}.`
                    return res.status(400).send(message)
                }

                const doneAt = task.doneAt ? null : new Date()
                updateTaskDoneAt(req, res, doneAt)
            })
            .catch(err => res.status(500).json(err))
    }

    return { getTasks, save, remove, toggleTask }
}