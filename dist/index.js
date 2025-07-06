import app from "./app.js";
import { dbConnect } from "./db/index.js";
const port = process.env.PORT || 4000;
// dbs connections
dbConnect();
app.listen(port, () => {
    console.log(`server is running  on port ${port}`);
});
