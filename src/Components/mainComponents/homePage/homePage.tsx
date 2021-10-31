import "./homePage.css";
import TeaserImg from "../../mainComponents/teaserImgProps/teaserImg";
import cartImg from "../../assets/cart.png";
import shoppingImg from "../../assets/shoppingBags.jpg";


function HomePage(): JSX.Element {
    const pictures = [
        { name: "UP TO 50% OFF !!", img: cartImg },
        { name: "MEGA BIG SALE!", img: shoppingImg }
    ]

    return (
        <div className="homePage">
            <h1>WELCOME TO THE BEST COUPON WEBSITE IN TOWN!</h1><br />
            In this website you can find coupons in variety categories<br />

            {pictures.map(item =>
                <TeaserImg key={item.name} img={item.img} title={item.name} />
            )}
        </div>
    );
}

export default HomePage;
