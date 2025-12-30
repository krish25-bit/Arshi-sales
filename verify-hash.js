const bcrypt = require('bcryptjs');

const password = "password123";
const hash = "$2b$10$Y6AUazqYHFt/lGTWqNptCOZCX1OeqVj7tz4L/.IlUiisCdQ2RR25a";

const isMatch = bcrypt.compareSync(password, hash);
console.log(`Password: ${password}`);
console.log(`Hash: ${hash}`);
console.log(`Is Match: ${isMatch}`);

if (!isMatch) {
    const newHash = bcrypt.hashSync(password, 10);
    console.log(`Correct Hash for '${password}': ${newHash}`);
}
