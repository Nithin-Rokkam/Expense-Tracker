import React, {useEffect, useState}from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useUserAuth from '../../hooks/useUserAuth';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosinstance';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import Modal from '../../components/layout/Modal';
import DeleteAlert from '../../components/layout/DeleteAlert';
import AddExpenseForm from '../../components/Expense/AddExpenseFrom';
import ExpenseList from '../../components/Expense/ExpenseList';
import {toast} from 'react-toastify';
import { Link } from 'react-router-dom';
const Expense = () => {
  useUserAuth();
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
      show:false,
      data :null,
    });
  const [OpenAddExpenseModal,setOpenAddExpenseModal] = useState(false);
  
  const fetchExpenseDetails = async () => {
    if(loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );

      if(response.data){
        setExpenseData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again", error);
    }finally {
      setLoading(false);
    }
  };

  //handle expenses
  const handleAddExpense = async(expense) => {
    const {category,amount,date,icon} = expense;
    
    //validate checks
    if(!category.trim()){
      toast.error("Category is required.");
      return;
    }
    if(!amount || isNaN(amount)  || Number(amount) <= 0){
      toast.error("Amount should be a valid nummber greater than 0.")
      return;
    }
    if(!date) {
      toast.error("Date is required.")
      return;
    }
    try{
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });
      
      setOpenAddExpenseModal(false);
      toast.success("Expense added Successsfully");
      await fetchExpenseDetails();
    } catch (error){
      console.error (
        "Error adding expense",
        error.response?.data?.message || error.message
      );
    }
  };

  //Delete Expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({show:false,data:null})
      toast.success("Expense details deleted successfully");
      await fetchExpenseDetails();
    } catch (error) {
      console.error (
        "Error deleting expense:",
        error.response?.data?.message || error.message
      );
    }
  };

  //handle download expense details
  const handleDownloadExpenseDetails = async() =>{
    try{
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        {
          responseType:"blob",
        }
      );

      //create URL for the blob
      const url  = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download","expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch(error){
      console.error("Error in downloading expense details:",error);
      toast.error("Failed to download expense details. Please try again!");
    }
  };


  useEffect(() => {
    fetchExpenseDetails();
    return() => {}
  },[])
  
  return (
      <DashboardLayout activeMenu="Income">
        <div className="my-5 mx-auto">
          <div className='grid grid-cols-1 gap-6'>
            <div className=''>
              <ExpenseOverview
                transactions = {expenseData}
                onAddExpense = {() => setOpenAddExpenseModal(true)}
              />
            </div>
            <ExpenseList transactions = {expenseData}
              onDelete = {(id) => {
                setOpenDeleteAlert({show:true, data :id});
              }}
              onDownload = {handleDownloadExpenseDetails}
              />
          </div>

          <Modal 
            isOpen = {OpenAddExpenseModal}
            onClose={() => setOpenAddExpenseModal(false)}
            titel = "Add Expense"
          > 
          <AddExpenseForm onAddExpense ={handleAddExpense} />
          </Modal>

          <Modal 
            isOpen = {openDeleteAlert.show}
            onClose={() => setOpenAddExpenseModal({show:false,data:null})}
            title = "Delete Expense"
          >
              <DeleteAlert 
                content = "Are you want to delete this expense details?"
                onDelete = {()  =>deleteExpense(openDeleteAlert.data)}
              />
          </Modal>
        </div>
      </DashboardLayout>
  )
}

export default Expense