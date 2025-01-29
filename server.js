import express from 'express' 
import cookieParser from 'cookie-parser'
import {bugService} from './services/bug.service.js'
import { userService } from './services/user.service.js'
import { authService } from './services/auth.service.js'
const app = express() 

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
app.listen(3032, () => console.log('Server ready at port 3032'))


// get all
app.get('/api/bug',(req, res) =>{
    const queryBy = {
        filter: req.query.filter,
        sort: req.query.sort,
       pageIdx : req.query.pageIdx
    }
    bugService.query(queryBy)
                    .then(bugs => res.send(bugs))
                    .catch(err => {
                        res.status(500).send('Cannot get bugs' , err)
                    })

})
// Create
app.post('/api/bug', (req, res) => {
    const bugToSave = {
        title: req.body.title,
        severity: +req.body.severity,
        description: req.body.description
    }
    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            res.status(500).send('Cannot save bug')
        })
})
//UPDATE
app.put('/api/bug/:id', (req, res) => {
    const bugToUpdate = {
        _id: req.body._id,
        title: req.body.title,
        severity: +req.body.severity,
        description: req.body.description
    }
    bugService.save(bugToUpdate)
        .then(upDatedBug => res.send(upDatedBug))
        .catch(err => {
            res.status(500).send('Cannot update bug')
        })
})


// get by id
app.get('/api/bug/:id', (req, res) => {
    let visitedBugs = req.cookies.visitedBugs || []
    const { bugId } = req.params
    if(!visitedBugs.includes(bugId )){
            if(visitedBugs.length >2) return res.status(401).send('Wait for a bit') 
            else visitedBugs.push(bugId)
            
    }
    res.cookie('visitedBugs', visitedBugs,{ maxAge: 1000 * 7 })
    
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            res.status(500).send('Cannot get bug')
        })


})

// remove
app.delete('/api/bug/:id', (req, res) => {

    const bugId  = req.params.id
    bugService.remove(bugId)
        .then(() => res.send(bugId + ' Removed Successfully!'))
        .catch(err => {
            res.status(500).send('Cannot remove bug')
        })

})

//      USER!
app.get('/api/user',(req,res) =>{
    userService.query()
                        .then(users => res.send(users))
                        .catch(err => {
                            res.status(400).send('Cannot load users')
                        })
})


app.get('/api/user/:userId', (req,res)=>{
    const { userId } = req.params
     userService.getById(userId)
                                .then(user => res.send(user))
                                .catch(err =>{
                                    res.status(400).send('user not found')
                                })
})

///      AUTH API!!!

app.post('/api/auth/login', (req,res) =>{
    const creden = req.body
    authService.checkLogin(creden)
                                .then(user =>{
                                    const loginToken = authService.getLoginToken(user) 
                                    res.cookie('loginToken', loginToken)
                                    res.send(user)
                                })
                                .catch(() => res.status(404).send('Invalid Credentials'))
})


app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    
    userService.add(credentials)
        .then(user => {
            if (user) {
                const loginToken = authService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot signup')
            }
        })
        .catch(err => res.status(400).send('Username taken.'))
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})