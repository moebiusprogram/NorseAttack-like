import Attack from '../attack2d/Attack';
import Detector from '../../util/Detector';
import Globe from '../attack3d/Globe';
import InfoContainer from '../InfoContainer/InfoContainer';
import InfoPanel from '../InfoPanel/InfoPanel';
import io from 'socket.io-client';
import moment from 'moment'
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
            hits: [],
            index: 0,
            actualInfo: { error: true },
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

        //this.hits[index]._source[""]
        let hit = this.state.hits[this.state.index]


        let info = {
            'from': {
                // 'lat': $('#flat').val(),
                // 'lng': $('#flng').val()
                'lat': hit._source["enrichments:geo:ip_src_addr:latitude"],
                'lng': hit._source["enrichments:geo:ip_src_addr:longitude"]
            },
            'to': {
                // 'lat': $('#tlat').val(),
                // 'lng': $('#tlng').val()
                'lat': hit._source["enrichments:geo:ip_dst_addr:latitude"],
                'lng': hit._source["enrichments:geo:ip_dst_addr:longitude"]
            },
            'origin': {
                'N': "",
                'COUNTRY': hit._source["enrichments:geo:ip_src_addr:country"]
            },
            'target': {
                'N': "",
                'COUNTRY': hit._source["enrichments:geo:ip_dst_addr:country"]
            },
            'type': {
                'N': hit._source["threat:triage:score"],
                'PORT': hit._source["ip_dst_port"],
                'SERVICE TYPE': hit._source["msg"]
            },
            'live': {
                'TIMESTAMP': moment(hit._source["timestamp"]).format("DD-MM-YYYY HH:mm:ss"),
                'ATTACKER': hit._source["protocol"]
            }
        }

        //new Date(unix_tm*1000)
        // moment(1439198499).format("DD-MM-YYYY HH:mm:ss")
        let { from, to, origin, target, type, live } = info;
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

        let index = 0

        if( this.state.index < this.state.hits.length ) {
            index  = this.state.index + 1
        }
        
        this.setState({
            'origins': origins,
            'targets': targets,
            'types': types,
            'attacks': attacks,
            'actualInfo': info,
            'index': index,
        });
    }

    componentDidMount() {

        this.getAttacksData()

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
        let t = 8000;

        //let intervalID = setInterval( this.getUpcommingAttacks, 8000 )

        let intervalID = setInterval( () => {
            this.getUpcommingAttacks()
            t = Math.random() * 200 + 300;
        }, t);
        this.setState({intervalID: intervalID})
    }

    getAttacksData = async () => {
  
          try{

              const urlRoute =  `/api/v1/overview/metron/snort/search/24h`

              const response = await fetch( urlRoute )

              const results = await response.json()

              if(results && results.hits) {


                console.log("Hits:", results.hits)
                this.setState({
                    hits: results.hits.hits
                })

              } else {

                this.setState({
                    loadingError: true,
                })
              }

          } catch(e) {
              console.log("error", e)

               this.setState({
                    loadingError: true,
                })
          }

    }

    getGeoCoordinatesFromIP = async (ip) => {

        let response = await fetch( `https://geo.ipify.org/api/v1?apiKey=at_Oiil06kR86370VPdscC1UgwoH0TbB&ipAddress=${ip}` )

        if(!response ) {
            return  res.status(422).json({error: "no response"})
        }

        let result = await response.json()

        if(!result ) {
            return  res.status(422).json({error: "no result"})
        }

        console.log( "results:", result ) 

        return result

    }


    componentWillUnMount() {
        if(window.webSocket) {
            delete window.webSocket;
        }
    }

    render() {

        //console.log( "render state", this.state.actualInfo )
        return (
            <div className='app'>
                <Attack  info={ this.state.actualInfo } />
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