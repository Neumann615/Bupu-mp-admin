import {useEffect, useRef, useState} from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import markerPng from "./poi-marker-red.png"
import "@amap/amap-jsapi-types";
import {createStyles} from "antd-style"
import {CloseOutlined, EnvironmentOutlined, SearchOutlined} from "@ant-design/icons";
import {Input, message, Popover} from "antd"

const useStyles = createStyles(({token, css}) => ({
    mapContainer: css`
      width: auto;
      height: auto;
      box-sizing: border-box;
      padding: ${token.paddingSM}px;
      background-color: ${token.colorBgContainer};
      border-radius: ${token.borderRadiusLG}px;
      position: relative;
      box-shadow: ${token.boxShadowTertiary};
    `,
    mapHeader: css`
      margin-bottom: ${token.marginSM}px;
      position: absolute;
      left: 18px;
      top: 18px;
      z-index: 999;
      background-color: ${token.colorBgBase};
      display: flex;
      border-radius: 8px;
      overflow: hidden;
    `,
    mapHeaderIcon: css`
      display: flex;
      color: ${token.colorTextLabel};

      span {
        cursor: pointer;
      }
    `,
    mapMain: css`
      border-radius: ${token.borderRadiusLG}px;
      overflow: hidden;
    `,
    suggestionItem: css`
      line-height: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      cursor: pointer;
    `
}))

interface CoordinateProps {
    /**地级市名称*/
    city: string,
    /**经纬度信息*/
    coords: Array<number>,
    /**地图id*/
    mapId: string,
    /**缩放比例*/
    zoom: number
    /**经纬度变化*/
    onChange: () => {},
    // onMapLoad: () => {},
    // onMapZoom: () => {},
    width: number | string
    height: number | string
}

Coordinate.defaultProps = {
    city: "武汉市",  //地级市名称
    cLon: 114.365248,   //地图中心经度
    cLat: 30.53786,   //地图中心纬度
    zoom: 14,  //缩放比例
    mapId: "bupu-map",
    onChange: () => {
    },
    //features: ['bg', 'point'],
    // onMapLoad: () => {
    // },
    // onMapZoom: () => {
    // },
    width: 800,
    height: 600
}

function Coordinate(props: CoordinateProps) {
    let map: AMap.Map | null = null
    const [messageApi, contextHolder] = message.useMessage();
    let AMapInstance = null
    let geocoder: AMap.Geocoder | null = null
    let nowMarker = null
    const {styles, theme} = useStyles()
    const [coords, setCoords] = useState(props.coords)
    const [addressInfo, setAddressInfo] = useState(null)
    //地址输入建议线管
    const [openAddressSuggestions, setOpenAddressSuggestions] = useState(false)
    const [addressSuggestions, setAddressSuggestions] = useState([])
    const [isFocus, setIsFocus] = useState(false)
    const searchInputRef = useRef(null)

    //倒退坐标转换成地址信息
    function reverseGeocode(lnglat) {
        geocoder.getAddress(lnglat, (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
                console.log("倒退后的信息", result, addressSuggestions)
                setAddressInfo(result.regeocode.formattedAddress);
            } else {
                console.log('Geocode failed', result);
            }
        })
    }

    //渲染当前坐标图标
    function renderMapMaker(AMap, lnglat) {
        if (!(map && AMap)) return
        const {lng, lat} = lnglat
        if (nowMarker) {
            map.remove(nowMarker)
        }
        const position = new AMap.LngLat(lng, lat); //Marker 经纬度
        nowMarker = new AMap.Marker({
            position: position,
            content: `<img style="width: 24px;" src="${markerPng}">`,
            offset: new AMap.Pixel(-13, -30), //以 icon 的 [center bottom] 为原点
        });
        map?.add(nowMarker)
    }

    //根据关键字获取地址补全
    function autoInput(keywords) {
        if (!keywords?.length) return
        setOpenAddressSuggestions(true)
        //setAddressSuggestions(JSON.parse("{\"info\":\"OK\",\"count\":10,\"tips\":[{\"id\":\"\",\"name\":\"武汉市\",\"district\":\"湖北省武汉市\",\"adcode\":\"420102\",\"location\":\"\",\"address\":\"江岸区\",\"typecode\":\"190104\",\"city\":[]},{\"id\":\"\",\"name\":\"乌海市\",\"district\":\"内蒙古自治区乌海市\",\"adcode\":\"150302\",\"location\":\"\",\"address\":\"海勃湾区\",\"typecode\":\"190104\",\"city\":[]},{\"id\":\"B001B0IZUF\",\"name\":\"武汉站\",\"district\":\"湖北省武汉市洪山区\",\"adcode\":\"420111\",\"location\":[114.424309,30.606689],\"address\":\"白云路\",\"typecode\":\"150200\",\"city\":[]},{\"id\":\"B01D90LVKG\",\"name\":\"乌海西站\",\"district\":\"内蒙古自治区乌海市乌达区\",\"adcode\":\"150304\",\"location\":[106.737752,39.455182],\"address\":\"三道坎\",\"typecode\":\"150200\",\"city\":[]},{\"id\":\"B0KUSUQ59K\",\"name\":\"乌海站(建设中)\",\"district\":\"内蒙古自治区乌海市海勃湾区\",\"adcode\":\"150302\",\"location\":[106.798763,39.712358],\"address\":[],\"typecode\":\"150200\",\"city\":[]},{\"id\":\"B001B0000A\",\"name\":\"武汉天河国际机场\",\"district\":\"湖北省武汉市黄陂区\",\"adcode\":\"420116\",\"location\":[114.221167,30.773612],\"address\":\"机场大道\",\"typecode\":\"150104\",\"city\":[]},{\"id\":\"B001B1CK6F\",\"name\":\"武汉北车站\",\"district\":\"湖北省武汉市黄陂区\",\"adcode\":\"420116\",\"location\":[114.31669,30.778418],\"address\":\"S1岱黄高速附近\",\"typecode\":\"150200\",\"city\":[]},{\"id\":\"B01D9000CN\",\"name\":\"乌海机场\",\"district\":\"内蒙古自治区乌海市海勃湾区\",\"adcode\":\"150302\",\"location\":[106.805016,39.794383],\"address\":\"机场路11公里处\",\"typecode\":\"150104\",\"city\":[]},{\"id\":\"B0FFGN3L7X\",\"name\":\"乌海机场航站楼\",\"district\":\"内蒙古自治区乌海市海勃湾区\",\"adcode\":\"150302\",\"location\":[106.808358,39.791725],\"address\":\"机场路11公里处\",\"typecode\":\"150104\",\"city\":[]},{\"id\":\"B0G10CFS2G\",\"name\":\"武汉东站\",\"district\":\"湖北省武汉市江夏区\",\"adcode\":\"420115\",\"location\":[114.430717,30.485934],\"address\":\"东湖新技术开发区(武汉东站地铁站D口步行120米)\",\"typecode\":\"150200\",\"city\":[]}]}").tips)
        AMap.plugin("AMap.AutoComplete", function () {
            // 注意：输入提示插件2.0版本需引入AMap.AutoComplete，而1.4版本应使用AMap.Autocomplete
            // 实例化AutoComplete
            var autoOptions = {
                city: "全国",
            };
            var autoComplete = new AMap.AutoComplete(autoOptions);
            autoComplete.search(keywords, function (status, result) {
                if (status === "complete" && result.info === "OK") {
                    setAddressSuggestions(result.tips)
                    setOpenAddressSuggestions(true)
                }
            });
        });
    }

    //选择当前地址


    useEffect(() => {
        if (!isFocus) return
        autoInput(addressInfo)
    }, [addressInfo])

    useEffect(() => {
        props.onChange(coords)
    }, [coords])

    useEffect(() => {

        window._AMapSecurityConfig = {
            securityJsCode: "6b0f0cf3526c1e12d1e2e6f3ab1b7913",
        }
        AMapLoader.load({
            key: "bef7d7eb79648bd94fd4ee2fff21c87d",  // Web端开发者Key，需配合密钥使用
            version: "2.0",  // 指定要加载的 JSAPI 的版本
            plugins: ["AMap.DistrictSearch", "AMap.PlaceSearch", "AMap.DistrictSearch", "AMap.ToolBar", "AMap.ElasticMarker", "AMap.Scale", "AMap.HawkEye", "AMap.ControlBar", "AMap.Geolocation", "AMap.Geocoder", "AMap.AutoComplete"],   // 需要使用的的插件列表，如比例尺"AMap.Scale"等
        }).then(AMap => {
            AMapInstance = AMap
            map = new AMap.Map(props.mapId, {
                viewModel: "2D",
                zoom: props.zoom,
                center: props.coords,
                features: ['bg', 'point'],
            });
            var toolbar = new AMap.ToolBar(); //创建工具条插件实例
            map.addControl(toolbar); //添加工具条插件到页面
            var scale = new AMap.Scale();
            map.addControl(scale);
            geocoder = new AMap.Geocoder()
            const autocomplete = new AMap.AutoComplete({
                input: 'search-input', // 输入框的ID
                placeSearchOptions: {
                    pageSize: 5, // 设置返回结果的数量
                    pageIndex: 1 // 设置返回结果的页码
                },
                city: '全国' // 设置城市，默认为全国
            });

            // 监听输入框的变化
            autocomplete.on('select', (data) => {
                console.log('Selected:', data);
            });

            autocomplete.on('searchComplete', (results) => {
                console.log("拿到数据了哈哈", results)
                setSuggestions(results.tips);
            });

            map?.on("click", (e) => {
                console.log("我被点击了", e, e.lnglat)
                setCoords([e.lnglat.lng, e.lnglat.lat])
                renderMapMaker(AMapInstance, e.lnglat)
                reverseGeocode(e.lnglat);
            })
        }).catch(e => {
            console.warn("地图控件报错", e);
        });


        return () => {
            map?.destroy();
        }
    }, []);

    return <div className={styles.mapContainer}
                style={{width: props.width + 2 * theme.paddingSM, height: props.height + 2 * theme.paddingSM}}>
        {contextHolder}
        <div className={styles.mapHeader}>
            <Popover
                open={openAddressSuggestions}
                placement={"bottom"}
                arrow={false}
                overlayInnerStyle={{width: "325px"}} content={<div>

                {addressSuggestions.map((item: any) => {
                    return <div className={styles.suggestionItem} onClick={() => {
                        console.log(coords, addressInfo, item)
                        if (!item.location) {
                            messageApi.open({
                                type: "info",
                                content: '当前地址无具体地址信息，请重新选择'
                            })
                            return
                        }
                        setCoords([item.location.lng, item.location.lat])
                        renderMapMaker(AMapInstance, item.location)
                    }
                    }>
                        <EnvironmentOutlined style={{color: theme.colorTextTertiary, marginRight: theme.marginXXS}}/>
                        <div className={"text-ellipsis"}>{item.name}</div>
                        <div className={"text-ellipsis"} style={{
                            marginLeft: theme.marginSM,
                            color: theme.colorTextSecondary,
                            fontSize: theme.fontSizeSM
                        }}> {item.district}</div>
                    </div>
                })}
            </div>}>
                <Input
                    onFocus={() => {
                        setIsFocus(true)
                    }}
                    onBlur={() => {
                        setIsFocus(false)
                        setOpenAddressSuggestions(false)
                    }}
                    ref={searchInputRef}
                    size={"large"}
                    addonAfter={<div className={styles.mapHeaderIcon}>
                        <SearchOutlined style={{marginRight: theme.marginSM, fontSize: '20px'}}/>
                        <CloseOutlined style={{fontSize: '20px'}}/>
                    </div>}
                    onChange={(e) => {
                        setAddressInfo(e.target.value)
                    }}
                    style={{width: "400px"}}
                    placeholder={"搜索位置"}
                    value={addressInfo}></Input>
            </Popover>

        </div>
        <div className={styles.mapMain}>
            <div style={{width: props.width, height: props.height}} id={props.mapId}/>
        </div>
    </div>
}

export {Coordinate}
export type {CoordinateProps}