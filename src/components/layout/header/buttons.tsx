
import Button from '../../ui/Button';
import { HiOutlineUserCircle} from "react-icons/hi2";
import { Link } from "react-router-dom";
import { useUser } from '../../ui/login/UserLoginProvider';

const Headerbuttons = () => {
    const { user } = useUser();

    if (user) {
        // User is logged in, show personalized button
        const displayName = user.name || 'پنل کاربری';
        const panelLink = user.role === 'doctor' ? '/doctor-Profile' :
                         user.role === 'patient' ? '/UserProfile' :
                         user.role === 'secretary' ? '/SecretaryProfile' : '/UserProfile';

        return (
            <div className='flex gap-2'>
                <Link to={panelLink}>
                    <Button
                        variant="solid"
                        icon={<HiOutlineUserCircle className="text-2xl"/>}
                        iconAlignment="start"
                        className=""
                        size='sm'
                    >
                        {displayName}
                    </Button>
                </Link>
            </div>
        );
    }

    // User not logged in, show original buttons
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