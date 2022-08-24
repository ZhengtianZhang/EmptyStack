import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import jwt from "express-jwt";
import jwks from "jwks-rsa";

var requireAuth = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH0_JWK_URI,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ["RS256"],
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/questions", async (req, res) => {
  //const auth0Id = req.user.sub;
  //console.log(user.sub)
  const posts = await prisma.Question.findMany({
    where: {
      author: {},
    },
  });

  res.json(posts);
}); 

// creates a question item
app.post("/question", requireAuth, async (req, res) => {
  //console.log(rew.user);
 // const auth0Id = req.user.sub;

  const { title, content, authorEmail} = req.body;

  if (!title) {
    res.status(400).send("title is required");
  } else {
    const newItem = await prisma.Question.create({
      data: {
        title: title,
        content: content,
        author: { connect: { email: authorEmail } },
      },
    });

    res.status(201).json(newItem);
  }
});



// deletes a question item by id
app.delete("/question/:id", requireAuth, async (req, res) => {

    const id = req.params.id;
  const deletedanswers = await prisma.Answer.deleteMany({
    where: {
        questionId: parseInt(id)
    },
  })

  const deletedItem = await prisma.Question.delete({
    where: {
      id: parseInt(id),
    },
  });   
  res.status(201).json(deletedItem);
});

// get a question item by id
app.get("/question/:id", async (req, res) => {
  const id = req.params.id;
  const questionItem = await prisma.Question.findUnique({
    where: {
      id: parseInt(id)
    },
  });
  res.json(questionItem);
});

// get all questions by the user
app.get("/questions/:id", requireAuth, async (req, res) => {
    const posts = await prisma.Question.findMany({
      where: {
        authorId:  parseInt(req.params.id),
      },
    });
  
    res.json(posts);
  });

// updates a question item by id
app.put("/question/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;
  const updatedQuestion = await prisma.Question.update({
    where: {
      id: parseInt(id)
    },
    data: {
      title,
      content
    },
  });
  res.json(updatedQuestion);
});

// get all answers
app.get("/answers", requireAuth, async (req, res) => {
    const answers = await prisma.Answer.findMany({
      where: {
        
      },
    });
  
    res.json(answers);
  });

// get a answer item by id
app.get("/answer/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  const answerItem = await prisma.Answer.findUnique({
    where: {
      id: parseInt(id)
    },
  });
  res.json(answerItem);
});

// get all answers by the user
app.get("/answers/:id", requireAuth, async (req, res) => {
    const answersByID = await prisma.Answer.findMany({
      where: {
        authorId:  parseInt(req.params.id),
      },
    });
  
    res.json(answersByID);
  });

  // get all answers by the question
app.get("/answers/byquestion/:id", async (req, res) => {
    const answersByQuestions = await prisma.Answer.findMany({
      where: {
        questionId:  parseInt(req.params.id),
      },
    });
  
    res.json(answersByQuestions);
  });

  // creates an answer item
app.post("/answer", requireAuth, async (req, res) => {
  
    const {  content, questionId, authorEmail} = req.body;
  
    if (!content) {
      res.status(400).send("content is required");
    } else {
      const newAnswer = await prisma.Answer.create({
        data: {
          content: content,
          question: { connect: { id: parseInt( questionId )} },
          author: { connect: { email: authorEmail } },
        },
      });
  
      res.status(201).json(newAnswer);
    }
  });

// updates a answer item by id
app.put("/answer/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  const content = req.body.content;
  const updatedAnswer = await prisma.Answer.update({
    where: {
      id: parseInt(id)
    },
    data: {
      content
    },
  });
  res.json(updatedAnswer);
});

  // deletes an answer item by id
app.delete("/answer/:id", requireAuth, async (req, res) => {
    //const id = req.params.id;
    const deletedAnswer = await prisma.Answer.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.status(201).json(deletedAnswer);
  });

// get Profile information of authenticated user
app.get("/me", requireAuth, async (req, res) => {
  const auth0Id = req.user.sub;

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  res.json(user);
});

// updates a user item by id
app.put("/user/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const updatedUser = await prisma.User.update({
    where: {
      id: parseInt(id)
    },
    data: {
      name
    },
  });
  res.json(updatedUser);
});

// verify user status, if not registered in our database we will create it
app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.user.sub;
  const email = req.user[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.user[`${process.env.AUTH0_AUDIENCE}/name`];

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });



  if (user) {
    res.json(user);
  } else {
    const newUser = await prisma.user.create({
      data: {
        email,
        auth0Id,
        name,
      },
    });

    res.json(newUser);
  }
});

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
 console.log(`Server running on http://localhost:${PORT} 🎉 🚀`);
});