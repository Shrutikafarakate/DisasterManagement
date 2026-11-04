// const mongoose = require("mongoose");

// const AlertSchema = new mongoose.Schema(
//   {
//     message: String,
//     region: String,
//     type: String,
//     severity: String,
//     expiresAt: Date,

//     active: {
//       type: Boolean,
//       default: true,
//     }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Alert", AlertSchema);


const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "LOW",
    },

    region: String,

    sourceType: {
      type: String,
      enum: ["ADMIN", "SYSTEM"],
      default: "ADMIN",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED"],
      default: "ACTIVE",
    },

    expiresAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", AlertSchema);
