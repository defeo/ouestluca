const express = require('express');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = low(new FileSync('.data/waypts.json'));
db.defaults({ 'waypts': [] }).write();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

app.get('/waypts.json', (req, res) => {
  res.json(db.getState());
})

app.all('/client/index.php', (req, res) => {
  const act = req.body.action;
  console.log(act);
  if (act == 'addpos') {
    delete req.body.action;
    db.get('waypts').push(req.body).write();
    res.json({ error: false });
  } else if (act == 'auth' || act == 'addtrack') {
    res.json({
      error: false,
      trackid: 1,
    });
  } else {
    console.err('Unknown action', act);
    console.status(404).json({ error: true });
  }
});

app.listen(process.env.PORT);