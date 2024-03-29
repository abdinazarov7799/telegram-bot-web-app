import React, {useState} from 'react';
import useGetOneQuery from "../../../hooks/api/useGetOneQuery.js";
import {URLS} from "../../../constants/url.js";
import {KEYS} from "../../../constants/key.js";
import {get, isArray, isEmpty, isEqual, isNil} from "lodash";
import {Button, Card, Col, Flex, Input, InputNumber, Row, Space, Spin, Typography} from "antd";
import {useTranslation} from "react-i18next";
import useStore from "../../../services/store/useStore.jsx";
import {useNavigate} from "react-router-dom";

const {Title,Text} = Typography;

const body = {
    padding: 8
}
const ProductContainer = ({category,userId}) => {
    const {t} = useTranslation();
    const {orders, setOrders,increment,decrement} = useStore();
    const [selectedProducts,setSelectedProducts] = useState([]);
    const navigate = useNavigate();
    const {data,isLoading} = useGetOneQuery({
        id: get(category,'id'),
        url: URLS.get_product,
        key: `${KEYS.get_product}_${get(category,'id')}`,
        params: {
            params: {
                user_id: userId
            }
        },
        enabled:!isNil(category)
    })

    const onChange = (value,item) => {
        let order = {
            count: value,
            id: get(item,'id'),
            variationId: get(item,'variationId')
        }
        setOrders(order)
    }
    const getCountForItem = (itemId) => {
        const order = orders.find((order) => order.id === itemId);
        return order ? order.count : 0;
    };
    if (isLoading) {
        return <Flex justify={"center"} style={{marginTop: 10}}><Spin /></Flex>
    }
    return (
        <div>
            <Title level={4}>{get(category,'name')}</Title>
            <Row gutter={[10,15]}>
                {
                    isArray(get(data,'data.data')) && get(data,'data.data',[])?.map((item,index) => {
                        return (
                            <Col span={8} key={index+1}>
                                <Card
                                    hoverable
                                    cover={<img src={get(item,'imageUrl')}/>}
                                    styles={{body}}
                                >
                                    <Title level={5}>{get(item,'name')}</Title>
                                    <Text>
                                        {Intl.NumberFormat('en-US').format(get(item,'price'))}
                                        {" "} {t("so'm")} {!get(item,'oneVariation') && t("dan")}
                                    </Text>
                                    {
                                        selectedProducts.findIndex((id) => isEqual(id,item.id)) ?
                                            <Button
                                                block
                                                type={"primary"}
                                                style={{marginTop: 7}}
                                                onClick={() => {
                                                    get(item,'oneVariation') ?
                                                        setSelectedProducts(prevState => {
                                                            return [...prevState,item.id]
                                                        }) : navigate(`/product/view/${userId}/${item.id}`)
                                                }}
                                            >
                                                {t("Savatga qo'shish")}
                                            </Button> :
                                            <Flex style={{marginTop: 7}} justify={"space-between"} align={"center"}>
                                                <Button
                                                    type={"primary"}
                                                    onClick={() => decrement(get(item,'id'))}
                                                >
                                                    -
                                                </Button>
                                                <Input
                                                    value={getCountForItem(get(item, 'id'))}
                                                    min={0}
                                                    controls={false}
                                                    type={"number"}
                                                    style={{textAlign: "center",width: 50}}
                                                    onChange={(e) => onChange(e.target.value,item)}
                                                />
                                                <Button
                                                    type={"primary"}
                                                    onClick={() => increment(item)}
                                                >
                                                    +
                                                </Button>
                                            </Flex>
                                    }
                                </Card>
                            </Col>
                        )
                    })
                }
            </Row>
        </div>
    );
};

export default ProductContainer;
