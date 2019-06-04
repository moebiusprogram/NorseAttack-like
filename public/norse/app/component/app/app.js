import Attack from '../attack2d/Attack';
import Detector from '../../util/Detector';
import Globe from '../attack3d/Globe';
import InfoContainer from '../InfoContainer/InfoContainer';
import InfoPanel from '../InfoPanel/InfoPanel';
import io from 'socket.io-client';
import React, { Component } from 'react';
import 'normalize.css';
import './app.scss';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.COUNTRIES = ['American', 'China', 'United Kingdom', 'Japan', 'France'];
        this.SERVICE_TYPE = ['smtp', 'telnet', 'rfb', 'http-alt', 'ms-sql-s'];
        this.COMPANY = ['GOOGLE', 'MICROSOFT', 'HUAWEI', 'BAIDU', 'CHINANET'];

        this.state = {
            nodes: {},
            edges: [],
            flight: [],
            origins: [],//攻击源
            types: [],//攻击类型
            targets: [], //攻击目标
            attacks: [], //实时信息
            data: {
                info: {
                    origin: {},
                    target: {},
                    type: {},
                    live: {}
                }
            }
        };
    }

    componentWillMount() {
        // add SocketIO.
        let socket = io('http://localhost:4000');
        window.webSocket = socket; // 存入全局变量.


        socket.on('connect', (c) => {
            console.log("连接成功..." + new Date().getTime());
            console.log("Conectado")
            socket.emit('hello', 'hello world!');
        });

        socket.on('disconnect', () => {
            console.log('you have been disconnected.')
        });

        socket.on('reconnect', () => {
            console.log('you have been reconnected');
        });

        socket.on('reconnect_error', () => {
            console.log('attempt to reconnect has failed');
        });
    }

    getUpcommingAttacks = () => {
        let info = {
            'from': {
                // 'lat': $('#flat').val(),
                // 'lng': $('#flng').val()
                'lat': Math.random() * 160 - 80,
                'lng': Math.random() * 360 - 180,
            },
            'to': {
                // 'lat': $('#tlat').val(),
                // 'lng': $('#tlng').val()
                'lat': Math.random() * 160 - 80,
                'lng': Math.random() * 360 - 180
            },
            'origin': {
                'N': Math.floor(Math.random() * 60),
                'COUNTRY': this.COUNTRIES[Math.floor(Math.random() * this.COUNTRIES.length)]
            },
            'target': {
                'N': Math.floor(Math.random() * 60),
                'COUNTRY': this.COUNTRIES[Math.floor(Math.random() * this.COUNTRIES.length)]
            },
            'type': {
                'N': Math.floor(Math.random() * 60),
                'PORT': Math.floor(Math.random() * 0xffff),
                'SERVICE TYPE': this.SERVICE_TYPE[Math.floor(Math.random() * this.SERVICE_TYPE.length)]
            },
            'live': {
                'TIMESTAMP': new Date().toString(),
                'ATTACKER': this.COMPANY[Math.floor(Math.random() * this.COMPANY.length)]
            }
        }

        let { origin, target, type, live } = info;
        let { origins, targets, types, attacks } = this.state;

        origins.push(origin);
        targets.push(target);
        types.push(type);
        attacks.push(live);

        [origins, targets, types, attacks].forEach((a) => {
            if(a.length >= 8) {
                a.shift();
            }
        });

        this.setState({
            'origins': origins,
            'targets': targets,
            'types': types,
            'attacks': attacks
        });
    }

    componentDidMount() {

        
        window.webSocket.on('link', (data) => {
            let { origin, target, type, live } = JSON.parse(data.info);
            let { origins, targets, types, attacks } = this.state;

            origins.push(origin);
            targets.push(target);
            types.push(type);
            attacks.push(live);

            [origins, targets, types, attacks].forEach((a) => {
                if(a.length >= 8) {
                    a.shift();
                }
            });

            this.setState({
                'origins': origins,
                'targets': targets,
                'types': types,
                'attacks': attacks
            });
        });
        let t = 500;

        //let intervalID = setInterval( this.getUpcommingAttacks, 8000 )

        let intervalID = setInterval( () => {
            this.getUpcommingAttacks()
            t = Math.random() * 200 + 300;
        }, 8000);
        this.setState({intervalID: intervalID})
    }

    componentWillUnMount() {
        if(window.webSocket) {
            delete window.webSocket;
        }
    }

    render() {
        return (
            <div className='app'>
                <Attack />
                <InfoContainer>
                    <InfoPanel items={this.state.origins} title='ATTACK ORIGINS' />
                    <InfoPanel items={this.state.types} title='ATTACK TYPES' />
                    <InfoPanel items={this.state.targets} title='ATTACK TARGETS' />
                    <InfoPanel items={this.state.attacks} title='LIVE ATTACKS' />
                    {Detector.webgl ? <Globe data={this.state.flight} /> : null}
                </InfoContainer>
            </div>
        );
    }
}