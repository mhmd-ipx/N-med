
import Button from '../../ui/Button';
import { HiOutlineUserCircle} from "react-icons/hi2";
import { Link } from "react-router-dom";

const Headerbuttons = () => {
    return (
        <div className='flex gap-2'>
        <Link to={`/UserProfile`}>
         <Button
                variant="solid"
                icon={<HiOutlineUserCircle className="text-2xl"/>}
                iconAlignment="start"
                className=""
                size='sm'
            >
                ورود کاربران
            </Button>   
        </Link>    
        <Link to={`/doctor-Profile`}> 
            <Button
                variant="outline"
 
                iconAlignment="start"
                className=""
                size='sm'
            >
                پرتال پزشکان
            </Button>
        </Link> 
        </div>
    );
}

export default Headerbuttons;