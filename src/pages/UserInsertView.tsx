
import UserFormInsert from './../components/user/UserFormInsert' 

function UserInsertView(){

  require('./UserInsertView.css');

  return (
    <section className="user-add  mb-4 mt-4 m-auto">
       <UserFormInsert />
    </section>
  ) 
}

export default UserInsertView;





