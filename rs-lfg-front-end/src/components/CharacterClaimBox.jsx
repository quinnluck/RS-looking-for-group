import React from 'react'
import API from '../utils/API';

import { withStyles } from '@material-ui/core/styles';
import {
    Container,
    Grid,
    Button,
    TextField
} from '@material-ui/core';

import Label from './shared-components/Label'
import SkillTemplate from './skill-components/SkillTemplate'



const styles = {
    root: {
        marginTop: '5%',
        backgroundColor: '#2D323B',
        border: '1px solid #000',
        borderRadius: '5px',
    },
    space: {
        margin: '10px'
    },
    skill_template: {
        display: 'flex',
        justifyContent: 'center',
    },
    skill_template_wrapper: {
        paddingBottom: '10px',
        paddingTop: '5px'
    },
    stats_button: {
        backgroundColor: "#005580",
        color: 'white',
        '&:hover': {
            backgroundColor: '#00699E',
        },
        '&.Mui-disabled': {
            color: '#747474',
            backgroundColor: '#A6A6A6'
        }
    },
    error_label: {
        fontSize: '16px',
    },
    character_name_box: {
        width: '220px'
    }
};

const CssTextField = withStyles({
    root: {
        borderRadius: 4,
        backgroundColor: 'white',
        color: '#0092DB',
        '& label.Mui-focused': {
            color: 'black',
        },
        '& .MuiFilledInput-underline:after': {
            borderBottomColor: '#0092DB',
        },
        '& .MuiFilledInput-root': {
            '& fieldset': {
                borderColor: 'black', 
            },
            '&.Mui-focused fieldset': {
                borderColor: '#0092DB',
            },
        },
    },
})(TextField);




class CharacterClaimBox extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            usernameInput: '',
            username: '',
            playerStats: undefined,
            errorMessage: undefined,
        }

        this._lookupStats = this._lookupStats.bind(this)
        this._onChangeUsername = this._onChangeUsername.bind(this)
    }

    render() {
        var { classes } = this.props

        return (
            <Container className={classes.root} maxWidth="md">
                <Label>Character Lookup</Label>

                    <Grid container direction="row" justify="center" alignItems="center">
                        <Grid item xs={5}>
                            <CssTextField
                                className={classes.character_name_box}
                                id="outlined-char-name"
                                label="Username (in game name)"
                                onChange={(e) => this.setState({ usernameInput: e.target.value })}
                                value={this.state.usernameInput}
                                margin="normal"
                                variant="filled"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Button
                                className={classes.stats_button}
                                variant="contained"
                                color="primary"
                                onClick={this._lookupStats}
                                disabled={this.state.usernameInput === ''}
                            >
                                Look up Stats
                            </Button>
                        </Grid>
                    </Grid>

                        
                    <div className={classes.skill_template_wrapper}>
                        {this.state.playerStats && this.state.username &&
                                <SkillTemplate
                                    className={classes.skill_template}
                                    characterName={this.state.username.charAt(0).toUpperCase() + this.state.username.slice(1)}
                                    combatlvl={this._calculateCombat(
                                        this.state.playerStats[1][1],
                                        this.state.playerStats[3][1],
                                        this.state.playerStats[2][1],
                                        this.state.playerStats[7][1],
                                        this.state.playerStats[5][1],
                                        this.state.playerStats[4][1],
                                        this.state.playerStats[24][1],
                                        this.state.playerStats[6][1]
                                    )}
                                    characterTotal={parseInt(this.state.playerStats[0][1]).toLocaleString()}
                                    characterXp={parseInt(this.state.playerStats[0][2]).toLocaleString()}
                                    attacklvl={this.state.playerStats[1][1]}
                                    defencelvl={this.state.playerStats[2][1]}
                                    strengthlvl={this.state.playerStats[3][1]}
                                    hplvl={this.state.playerStats[4][1]}
                                    rangedlvl={this.state.playerStats[5][1]}
                                    prayerlvl={this.state.playerStats[6][1]}
                                    magiclvl={this.state.playerStats[7][1]}
                                    cookinglvl={this.state.playerStats[8][1]}
                                    wclvl={this.state.playerStats[9][1]}
                                    fletchinglvl={this.state.playerStats[10][1]}
                                    fishinglvl={this.state.playerStats[11][1]}
                                    fmlvl={this.state.playerStats[12][1]}
                                    craftinglvl={this.state.playerStats[13][1]}
                                    smithinglvl={this.state.playerStats[14][1]}
                                    mininglvl={this.state.playerStats[15][1]}
                                    herblorelvl={this.state.playerStats[16][1]}
                                    agilitylvl={this.state.playerStats[17][1]}
                                    thievinglvl={this.state.playerStats[18][1]}
                                    slayerlvl={this.state.playerStats[19][1]}
                                    farminglvl={this.state.playerStats[20][1]}
                                    rclvl={this.state.playerStats[21][1]}
                                    hunterlvl={this.state.playerStats[22][1]}
                                    constructionlvl={this.state.playerStats[23][1]}
                                    summoninglvl={this.state.playerStats[24][1]}
                                    dunglvl={this.state.playerStats[25][1]}
                                    divlvl={this.state.playerStats[26][1]}
                                    inventionlvl={this.state.playerStats[27][1]}
                                />
                        }
                        {this.state.errorMessage &&
                            <Label className={classes.error_label}>{this.state.errorMessage}</Label>
                        }
                    </div>

            </Container>
        )
    }

    _onChangeUsername(e) {
        this.setState({
            usernameInput: e.target.value
        })
    }

    _lookupStats = () => {
        API.get(`/player/${this.state.usernameInput}`).then(res => {

            var stats = res.data.split('\n')
            var splitStats = stats.map(stat => stat.split(','))

            console.log("stats: " + splitStats)

            this.setState({ errorMessage: undefined, playerStats: splitStats, username: this.state.usernameInput })
        }).catch(error => {
            this.setState({ 
                errorMessage: "User not found!  Membership is needed for hiscores, or user was misspelled.",
                username: '',
                playerStats: undefined
            })
            console.log("error: " + error)
        })
    }

    _calculateCombat = (atk, str, def, mage, range, hp, summ, prayer) => {
        return Math.floor(((1.3 * Math.max((parseInt(atk) + parseInt(str)), (2*parseInt(mage)), (2*parseInt(range)))) + parseInt(def) + parseInt(hp) + Math.floor(.5 * parseInt(summ)) + Math.floor(.5 * parseInt(prayer))) / 4)
    }
}

export default withStyles(styles)(CharacterClaimBox)
