const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 5055;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.enpeg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log("database has been connected", uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const DoctorCollection = client
    .db("HospitalDatabase")
    .collection("doctorsItem");
  const AddCollection = client.db("HospitalDatabase").collection("doctorDb");
  const AddReview = client.db("HospitalDatabase").collection("reviews");
  const AdminCollection = client.db("HospitalDatabase").collection("admins");

  app.post("/addAppointment", (req, res) => {
    const appointment = req.body;
    DoctorCollection.insertOne(appointment).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  ///show-appointment-

  app.get("/doctorsItem", (req, res) => {
    DoctorCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });
  ///update-appointment
  app.patch("/updateStatus/:id", (req, res) => {
    DoctorCollection.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        $set: { status: req.body.value },
      }
    ).then((result) => res.send(result.modifiedCount > 0));
  });

  ///appointment___________delete
  app.delete("/deleteAppointment/:id", (req, res) => {
    const id = ObjectId(req.params.id);
    console.log(id);
    DoctorCollection.findOneAndDelete({ _id: id }).then((err, documents) =>
      res.send(documents)
    );
  });

  //appointmentsShowByDate
  app.post("/appointmentsByDate", (req, res) => {
    const date = req.body;
    const email = req.body.email;

    AddCollection.find({ email: email }).toArray((err, doctors) => {
      const filter = { date: date.date };
      if (doctors.length === 0) {
        filter.email = email;
      }

      DoctorCollection.find(filter).toArray((err, documents) => {
        console.log(email, date.date, doctors, documents);
        res.send(documents);
      });
    });
  });

  app.post("/addDoctor", (req, res) => {
    const addDoctor = req.body;
    console.log("date", addDoctor);
    AddCollection.insertOne(addDoctor).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/doctorDb", (req, res) => {
    AddCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  //review
  app.post("/peopleReview", (req, res) => {
    const review = req.body;
    console.log("review", review);
    AddReview.insertOne(review).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  ///review gets
  app.get("/reviews", (req, res) => {
    AddReview.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.delete("/deleteReview/:id", (req, res) => {
    const id = ObjectId(req.params.id);
    console.log(id);
    AddReview.findOneAndDelete({ _id: id }).then((err, documents) =>
      res.send(documents)
    );
  });
  ///
  app.delete("/deleteAdmin/:id", (req, res) => {
    const id = ObjectId(req.params.id);
    console.log(id);
    AdminCollection.findOneAndDelete({ _id: id }).then((err, documents) =>
      res.send(documents)
    );
  });
  ///make___ a ___admin
  app.post("/isAdmin", (req, res) => {
    const email = req.body.email;
    AdminCollection.find({ email: email }).toArray((err, admins) => {
      res.send(admins.length > 0);
    });
  });

  ///

  ///admin-get-and__post
  app.post("/addAdmin", (req, res) => {
    const admin = req.body;
    AdminCollection.insertOne(admin).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  ///get
  app.get("/admins", (req, res) => {
    AdminCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });
  ////
});

///browser___status
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
