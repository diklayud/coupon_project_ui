import "./teaserImg.css";

interface TeaserProps {
    img: string;
    title: string;
}

function TeaserImg(props: TeaserProps): JSX.Element {
    const size = 200;

    return (
        <div className="teaserImg smallBox">
            <img src={props.img} width={size} height={size} />
            <br />
            <span>{props.title}</span>
        </div>
    );
}

export default TeaserImg;
