import {Layout} from "@/layout/Layout"
import {useMount} from "ahooks"
import {getMenuInfo} from "@/api"
import {useMenuStore} from "@/store";
import {menuData} from "@/utils";

console.log("初始化菜单数据", menuData)
export default function Home() {
    return <Layout></Layout>
}