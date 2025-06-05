const users = [
    {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "123456",
        role: "admin",
    },
    {
        name: "Mark Zuckerberg",
        email: "mark.zuckerberg@example.com",
        password: "123456",
        role: "user",
    }
];

const getAllUsers = (req, res) => {
  res.json(users);
};


export {
  getAllUsers
};