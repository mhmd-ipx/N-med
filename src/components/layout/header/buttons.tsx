
import Button from '../../ui/Button';
import { HiOutlineUserCircle ,  HiUserPlus} from "react-icons/hi2";
const Headerbuttons = () => {
    return (
        <div className='flex gap-2'>
        <Button
                variant="solid"
                icon={<HiOutlineUserCircle className="text-2xl"/>}
                iconAlignment="start"
                className=""
                size='sm'
            >
                ورود کاربران
            </Button>
            <Button
                variant="outline"
 
                iconAlignment="start"
                className=""
                size='sm'
            >
                پرتال پزشکان
            </Button>
        </div>
    );
}

export default Headerbuttons;