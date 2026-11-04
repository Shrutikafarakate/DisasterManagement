// const express = require("express");
// const router = express.Router();
// const SOS = require("../models/SOS");

// /**
//  * CREATE SOS (Public)
//  * Expects latitude & longitude from client
//  * Stores them correctly inside location object
//  */
// router.post("/public", async (req, res) => {
//   try {
//     const { latitude, longitude, address } = req.body;

//     if (latitude == null || longitude == null) {
//       return res.status(400).json({ message: "Coordinates missing" });
//     }

//     const sos = await SOS.create({
//       location: {
//         lat: Number(latitude),
//         lng: Number(longitude),
//         address: address || null,
//       },
//       status: "PENDING",
//     });

//     res.status(201).json({
//       message: "SOS received",
//       sos,
//     });
//   } catch (err) {
//     console.error("SOS create error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * GET ALL SOS (Admin)
//  * Uses createdAt instead of timestamp
//  */
// router.get("/all", async (req, res) => {
//   try {
//     const sosList = await SOS.find().sort({ createdAt: -1 });
//     res.json(sosList);
//   } catch (err) {
//     console.error("SOS fetch error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * UPDATE SOS STATUS (Admin)
//  * Only updates status, preserves location
//  */
// router.put("/:id/status", async (req, res) => {
//   try {
//     const { status } = req.body;

//     const sos = await SOS.findByIdAndUpdate(
//       req.params.id,
//       { $set: { status } },
//       { new: true }
//     );

//     if (!sos) {
//       return res.status(404).json({ message: "SOS not found" });
//     }

//     res.json(sos);
//   } catch (err) {
//     console.error("SOS update error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const SOS = require("../models/SOS");

/**
 * CREATE SOS (Public)
 * Expects latitude & longitude from client
 * Stores them correctly inside location object
 */
router.post("/public", async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;

    if (latitude == null || longitude == null) {
      return res.status(400).json({ message: "Coordinates missing" });
    }

    const sos = await SOS.create({
      location: {
        lat: Number(latitude),
        lng: Number(longitude),
        address: address || null,
      },
      status: "PENDING",
    });

    res.status(201).json({
      message: "SOS received",
      sos,
    });
  } catch (err) {
    console.error("SOS create error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET ALL SOS (Admin)
 * Uses createdAt instead of timestamp
 */
router.get("/all", async (req, res) => {
  try {
    const sosList = await SOS.find().sort({ createdAt: -1 });
    res.json(sosList);
  } catch (err) {
    console.error("SOS fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * UPDATE SOS STATUS (Admin)
 * Only updates status, preserves location
 */
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const sos = await SOS.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );

    if (!sos) {
      return res.status(404).json({ message: "SOS not found" });
    }

    res.json(sos);
  } catch (err) {
    console.error("SOS update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
