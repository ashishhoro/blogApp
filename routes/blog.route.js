import { Router } from "express";
import path from "path";
import multer from "multer";
import { Blog } from "../models/blog.model.js";
import { Comment } from "../models/comment.model.js";

const router = Router();

//storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`))
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + '-' + file.originalname
    cb(null, fileName )
  }
});

const upload = multer({ storage: storage })

router.get('/addBlog',  (req, res) => {
    return res.render('addBlog', {
        user: req.user
    })
})

router.get("/:id", async(req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  // console.log(blog);
  const comments = await Comment.find({blogId: req.params.id}).populate("createdBy");
  // console.log("comments", comments);

  if(!blog) return res.status(400).json({
    error: "something wrong while fetching data"
  });

  return res.render("blog", {
    user: req.user,
    blog,
    comments
  })

})
router.post("/comment/:blogId", async (req, res) => {
  const comment = await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id
  })
  
  return res.redirect(`/blog/${req.params.blogId}`);
})

router.post('/', upload.single("coverImage"),async (req, res) => {
    const {title, body} = req.body;
    const blog = await Blog.create({
        title,
        body,
        coverImageUrl: `./uploads/${req.file.filename}`,
        createdBy: req.user._id
    })
    return res.redirect("/blog/" + blog._id);
    
})

export default router;