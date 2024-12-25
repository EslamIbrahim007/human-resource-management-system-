import {mongoose} from "mongoose"
;

const dbConnation = () => {
  mongoose.connect(process.env.DB_URL).then((result) => {
    console.log(`Database Conected :${result.connection.host}`)
  }).catch((err) => {
    console.error(`Datebase Error: ${err}`);
    process.exit()
  });
};

export default dbConnation;