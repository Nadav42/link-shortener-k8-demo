
import { app } from './src/app';

// routes
import "./src/go-router";

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json({ msg: "hello" });
});

app.listen(3000, () => {
    console.log(`Example app listening on port ${port}`);
});