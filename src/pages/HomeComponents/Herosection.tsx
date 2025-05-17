
import herosectionimage from '../../assets/images/hero-section-image.svg'; 
const Herosection = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full bg-primary pt-11 pb-32">
            <div className='max-w-[1300px] mx-auto'>
                <img src={herosectionimage} alt="Logo" className="h-[400px] w-auto" />
            </div>
            
        </div>
    );
}

export default Herosection;