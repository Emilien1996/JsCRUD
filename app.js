const Users = document.querySelector('.users')
const modal = document.querySelector('#exampleModal')
const modalbuttons = document.querySelector('.modal-footer')
const editButton = document.querySelector('.edit-users')
editButton.style.display = "none"
editButton.textContent = "Edit"
 modalbuttons.appendChild(editButton)
let row = ''

const appendUser = (data) => {

	for (let i = 0 ; i < data.length;i++){
	
		
	 row +=`
	 <tr data-id={${data[i].id}}>
	 <td id="user_name">${data[i].name}</td>
	 <td id="user_email">${data[i].email}</td>
	 <td id="user_address">${data[i].address.street ? data[i].address.street : data[i].address}</td>
	 <td id="user_phone">${data[i].phone}</td>
	 <td>
	  <button class="btn btn-warning text-light edit-user" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button>
	  <button class="btn delete-user"><i class="bi bi-trash text-danger delete-user"></i></button>
	 </td>
	 <tr>
	 `
	
	 Users.innerHTML = row

	}
}

const getUsers = () => {
	fetch('https://jsonplaceholder.typicode.com/users')
	.then(res => res.json())
	.then(data => appendUser(data))
}




const userName = document.querySelector('#name')
const userEmail = document.querySelector('#email')
const userAddress = document.querySelector('#address')
const userPhone =  document.querySelector('#phone')



const addUserButton = document.querySelector('.add-users')
addUserButton.addEventListener('click',(e)=> {
	fetch('https://jsonplaceholder.typicode.com/users',{
		method:"POST",
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
		body:JSON.stringify({
name:userName.value,
email:userEmail.value,
phone:userPhone.value,
address:userAddress.value
		})
	})
	.then(res => res.json())
	.then(data => {
		const dataArr = []
		dataArr.push(data)
	
		appendUser(dataArr)
	})
	resetForm()

})


function resetForm(){
	userName.value = ""
	userPhone.value = ""
	userAddress.value = ""
	userEmail.value = ""
}



Users.addEventListener('click',(e)=>{
	e.preventDefault()
let deletebutton = e.target.classList.contains("delete-user")
let editbutton = e.target.classList.contains('edit-user')
if(deletebutton){
	let id = e.target.closest('tr').dataset.id
	fetch(`https://jsonplaceholder.typicode.com/users/${id}`,{
		method:"DELETE"
	})
	.then(res => res.json())
	.then(()=> e.target.closest('tr').remove())
}
if(editbutton){
	let id = e.target.closest('tr').dataset.id
	

addUserButton.style.display = "none"
editButton.style.display = 'block'
 modalbuttons.appendChild(editButton)
 
	const parent = e.target.parentElement.parentElement
	const nameValue = parent.querySelector('#user_name')
    const emailValue = parent.querySelector('#user_email')
    const phoneValue = parent.querySelector('#user_phone')
	const addressValue = parent.querySelector('#user_address')
	userName.value = nameValue.textContent
	userPhone.value = phoneValue.textContent
	userAddress.value = addressValue.textContent
	userEmail.value = emailValue.textContent
	editButton.addEventListener('click',()=>{
		
		fetch(`https://jsonplaceholder.typicode.com/users/${id}`,{
			method: 'PATCH',
			body: JSON.stringify({
				id: id,
				phone: userPhone.value,
				email: userEmail.value,
				address: userAddress.value,
        name:userName.value
			}),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		})
		.then(res => res.json())
		.then(data => {
			console.log(data)
			nameValue.textContent = data.name
			emailValue.textContent = data.email
			addressValue.textContent = data.address
			phoneValue.textContent = data.phone
		})
		.then(()=>resetForm())
		.then(()=> editButton.style.display = "none")
		.then(()=> addUserButton.style.display = "block")
	})
}
})
