const mongoose = require('mongoose');
const VehicleProvider = require('./models/VehicleProvider');

console.log("Schema Paths:", Object.keys(VehicleProvider.schema.paths));
console.log("Schema Required Paths:", VehicleProvider.schema.requiredPaths());

process.exit();
