import './navbar.css'

export default function NavbarUserForm({busName}) {

    return(
        <div class="topnav">
            <div className='bus-title'>{busName}</div>
        </div>
    )
}