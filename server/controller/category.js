import { category } from "../models/category.js";
export const addCategory = async (req, res) => {
  
        const { name,image} = req.body;
        const saveData = new category({ name,image});
      try {
        await saveData.save();
        res.status(200).json({ message: "Added Sucessfully" });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: `${error}` });
      }
    };


    export const getCategory = async (req, res) => {
        try {
          const categories = await category.find().sort({createdAt:-1});
          res.status(200).json( categories );
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "failed" });
        }
      };
  