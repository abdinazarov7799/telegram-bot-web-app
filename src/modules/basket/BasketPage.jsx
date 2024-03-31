import React, {useEffect, useState} from 'react';
import Container from "../../components/Container.jsx";
import {Button, Col, Empty, Flex, Image, Input, Row, Space, theme, Typography} from "antd";
import {useTranslation} from "react-i18next";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {get, isEmpty, isNil} from "lodash";
import {useNavigate, useParams} from "react-router-dom";
import useStore from "../../services/store/useStore.jsx";
import usePostQuery from "../../hooks/api/usePostQuery.js";
import {KEYS} from "../../constants/key.js";
import {URLS} from "../../constants/url.js";
const {Title,Text} = Typography;
const BasketPage = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const {orders,setOrders,increment, decrement} = useStore();
    const {t} = useTranslation()
    const navigate = useNavigate()
    const {userId,lang,isOpen} = useParams()
    const [fullPrice, setFullPrice] = useState(0);
    const {mutate,isLoading} = usePostQuery({
        listKeyId: KEYS.get_order,
    })

    useEffect(() => {
        orders?.map((order) => {
            setFullPrice((get(order,'count') * get(order,'price')))
        })
    }, [orders]);

    const dispatchOrder = () => {
        if (!isNil(orders)){
            mutate({
                    url: URLS.add_order,
                    attributes: orders,
                    config: {
                        params: {
                            user_id: userId
                        }
                    }
                },
                {
                    onSuccess: () => {
                        setOrders([]);
                        setFullPrice(0);
                    }
                })
        }
    }
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}}>
                <Flex>
                    <Button
                        type={"primary"}
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(`/${userId}/${lang}/${isOpen}`)}
                    >
                        {t("Back")}
                    </Button>
                </Flex>
                {
                    isEmpty(orders) ? (
                        <Flex justify={"center"} vertical align={"center"} style={{marginTop: 100}}>
                            <Empty description={false}/>
                            <Text>{t("Malumot yo'q")}</Text>
                        </Flex>
                    ) : (
                        <Row gutter={[5,15]} style={{paddingBottom: 70}}>
                            {
                                orders?.map((item,index) => {
                                    return (
                                        <Col span={24} key={index+1}>
                                            <Row>
                                                <Col span={5}>
                                                    <Image
                                                        src={get(item,'imageUrl')}
                                                        preview={false}
                                                        width={90}
                                                        height={90}
                                                    />
                                                </Col>
                                                <Col span={12}>
                                                    <Space direction={"vertical"}>
                                                        <Title level={5}>{get(item,'name')}</Title>
                                                        <Text>{get(item,'variationName','variationName')}</Text>
                                                        <Text>{get(item,'price')} {t("so'm")}</Text>
                                                    </Space>
                                                </Col>
                                                <Col span={7} >
                                                    <Space direction={"vertical"} size={"large"}>
                                                        <Text>{get(item,'price') * get(item,'count')} {t("so'm")}</Text>
                                                        <Flex>
                                                            <Button
                                                                type={"primary"}
                                                                onClick={() => decrement(get(item,'id'))}
                                                            >
                                                                -
                                                            </Button>
                                                            <Input style={{textAlign: "center", margin: "0 5px"}} value={get(item,'count')}/>
                                                            <Button
                                                                type={"primary"}
                                                                onClick={() => increment(item)}
                                                            >
                                                                +
                                                            </Button>
                                                        </Flex>
                                                    </Space>
                                                </Col>
                                            </Row>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    )
                }
                <div style={{position: "fixed", bottom: 0,left: 0, padding: "7px 15px", backgroundColor: colorBgContainer, width: "100%"}}>
                    <Space direction={"vertical"} style={{width: "100%"}}>
                        <Flex justify={"space-between"} align={"center"}>
                            <Text>
                                {t("Общая стоимость товаров:")}
                            </Text>
                            <Text>
                                {fullPrice} {t("so'm")}
                            </Text>
                        </Flex>
                        <Button block type={"primary"} onClick={dispatchOrder} loading={isLoading}>
                            {t("Оформить заказ")}
                        </Button>
                    </Space>
                </div>
            </Space>
        </Container>
    );
};

export default BasketPage;