import React from 'react';
import {useTranslation} from "react-i18next";
import {useNavigate, useParams} from "react-router-dom";
import Container from "../../components/Container.jsx";
import {Button, Empty, Flex, Space, Typography} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import useGetAllQuery from "../../hooks/api/useGetAllQuery.js";
import {KEYS} from "../../constants/key.js";
import {URLS} from "../../constants/url.js";
import {get, isEmpty} from "lodash";
const {Text} = Typography;
const OrdersPage = () => {
    const {t} = useTranslation()
    const navigate = useNavigate()
    const {userId,lang,isOpen} = useParams()
    const {data,isLoading} = useGetAllQuery({
        key: KEYS.get_all_order,
        url: URLS.get_all_order,
        params: {
            params: {
                user_id: userId,
            }
        }
    })

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
                    isEmpty(get(data,'data.data')) ? (
                        <Flex justify={"center"} vertical align={"center"} style={{marginTop: 100}}>
                            <Empty description={false}/>
                            <Text>{t("Malumot yo'q")}</Text>
                        </Flex>
                    ) : (
                        <></>
                    )
                }
            </Space>
        </Container>
    );
};

export default OrdersPage;