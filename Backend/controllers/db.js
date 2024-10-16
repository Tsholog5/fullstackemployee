const {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} = require("firebase/firestore");
const { db } = require("../config/firebase");

const addEmployee = async (req, res) => {
  const { firstName, lastName, idNumber, gender, age, email } = req.body;

  try {
    const docRef = await addDoc(collection(db, "employees"), {
      firstName: firstName,
      lastName: lastName,
      idNumber: idNumber,
      gender: gender,
      age: age,
      email: email,
    });

    res.json({
      message: "Addedd successfully",
    });
  } catch (error) {
    console.log(" Adding employee errror", error);
  }
};

const getEmployees = async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "employees"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Fetched employees: ", data); 

    res.json({
      data: data,
    });
  } catch (error) {}
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, idNumber, gender, age, email } = req.body;
    if (!firstName || !lastName || !idNumber || !gender || !age || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const employeeDocRef = doc(db, "employee", id);
    await setDoc(employeeDocRef, {
      firstName: firstName,
      lastName: lastName,
      idNumber: idNumber,
      gender: gender,
      age: age,
      email: email,
    });
    res.json({
      message: "Employee updated successfully",
    });
  } catch (error) {
    console.log("Error updating employee", error);
    res.status(500).json({ error: "Failed to update employee" });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeDocRef = doc(db, "user", id);
    await deleteDoc(employeeDocRef);
    res.json({
      message: "Employee successfully deleted",
    });
  } catch (error) {
    console.log("Error in deleting employee", error);
    res.status(500).json({ error: "Failed to delete employee" });
  }
};

module.exports = {
  addEmployee,
  getEmployees,
  deleteEmployee,
  updateEmployee,
};
