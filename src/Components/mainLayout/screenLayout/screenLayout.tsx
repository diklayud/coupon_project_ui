import { BrowserRouter } from "react-router-dom";
import AsideScreen from "../asideScreen/asideScreen";
import FooterScreen from "../footerScreen/footerScreen";
import HeaderScreen from "../headerScreen/headerScreen";
import Routing from "../routing/routing";
import "./screenLayout.css";

function ScreenLayout(): JSX.Element {
    return (
        <div className="screenLayout">
            <BrowserRouter>
                <header>
                    <HeaderScreen />
                </header>
                <aside>
                    <AsideScreen />
                </aside>
                <main>
                    <Routing />
                </main>
                <footer>
                    <FooterScreen />
                </footer>
            </BrowserRouter>
        </div>
    );
}

export default ScreenLayout;
