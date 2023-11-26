<template>
<div class="container">
    <div class="d-flex gap-5">
        <div class="content-left" style="width: 30%;">
            <div class="mb-4">
                <button type="button" class="btn btn-primary" style="width: 100%;">Import documents</button>
            </div>
            <hr>
            <div>
                <div class="d-flex justify-content-between mb-3">
                    <span>Storage</span>
                    <span><a href="javascript:void(0)">Change plan</a></span>
                </div>
                <div class="progress-bar mb-3">
                    <div class="progress" :style="{width: percent+'%'}"></div>
                </div>
                <div class="percent"><span style="color: #3c71f1;">{{ this.totalPercent.toFixed(3) }}%</span> used of 2GB</div>
                <hr>
            </div>
            <div class="mb-3">
                <label class="mb-3">Search</label>
                <div class="input-group">
                    <div class="input-group-prepend" style="position: absolute;
                        left: 80%;
                        top: 0;
                        z-index: 2;
                        bottom: 0;" @click="searchImage()">
                        <span class="input-group-text" style="height: 100%;background: transparent;border: none;color: #d9dce0;"><i class="fa fa-search"></i></span>
                    </div>
                    <input type="text" class="form-control" v-model="keyword" placeholder="Search">
                </div>
            </div>
            <div class="mb-3">
                <div class="d-flex justify-content-between mb-3">
                    <span>Folders</span>
                    <span><a href="javascript:void(0)">New folder</a></span>
                </div>
                <ul id="myul" v-for="(value, index) in this.data" :key="index">
                    <li>
                        <span class="caret" @click="getImageToFolder(value)">
                            <i class="fa-solid fa-folder-open"></i> {{ value.name }}
                            <label style="width: 20px;background-color: #d9dce0; text-align: center;border-radius: 5px;" v-if="value.children">{{ value.children.length }}</label>
                        </span>
                        <ul class="nested" v-if="value.children.length > 0">
                            <li v-for="(val, i) in value.children" :key="i">
                                <span class="caret" @click="getImageToFolder(val)">
                                    <i class="fa-solid fa-folder-open"></i> {{val.name}}
                                    <label style="width: 20px;background-color: #d9dce0; text-align: center;border-radius: 5px;" v-if="val.children">{{ val.children.length }}</label>
                                </span>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div>
                <div class="d-flex justify-content-between mb-3">
                    <span>Members</span>
                    <span><a href="javascript:void(0)">Select all</a></span>
                </div>
                <div class="member" v-for="(value, index) in this.members" :key="`checked${index}`">
                    <input class="form-check-input me-1" @change="getImageToMember(value)" type="checkbox" v-model="value.checked" :id="value.id">
                    <label class="form-check-label" :for="value.id">{{ value.name }}</label>
                </div>
            </div>
        </div>
        <div class="content-right">
            <table class="table table-borderless">
                <thead>
                    <tr>
                        <th><input type="checkbox" id="image1" name="image1"></th>
                        <th>Select all</th>
                        <th>Name</th>
                        <th>Dimmension</th>
                        <th>Size</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(data, index) in this.allImage">
                        <td>
                            <input type="checkbox" id="image1" name="image1">
                        </td>
                        <td>
                            <label for="image1">
                                <img :src="data.url" alt="Hình ảnh 1">
                            </label>
                        </td>
                        <td>{{ data.name }}</td>
                        <td>{{ data.dimmension }}</td>
                        <td>{{ this.convertBytesToKilobytes(data.size) }} kB</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: "test",
    data() {
        return {
            data: [{
                    "id": 1,
                    "name": "Uploads",
                    "children": [{
                            "id": 10,
                            "name": "Images",
                            "children": [{
                                    "id": 101,
                                    "name": "Seasandiego.jpg",
                                    "url": "https://assets.site-static.com/userFiles/2597/image/2023/CARDIFF_BY_THE_SEA/5-23-2023_1__reasons-why-cardiff-by-the-sea-san-diego-great-place-to-live/9_Reasons_Why_Cardiff-by-the-Sea_San_Diego_.jpg",
                                    "type": "image/jpg",
                                    "dimmension": "2000 x 2000",
                                    "size": "763300",
                                    "photo_by": "Admin"
                                },
                                {
                                    "id": 102,
                                    "name": "iMactwin.png",
                                    "url": "https://i.insider.com/60e4cb0d22d19400191c957c?width=1000&format=jpeg&auto=webp",
                                    "type": "image/png",
                                    "dimmension": "2000 x 2000",
                                    "size": "640200",
                                    "photo_by": "Apple"
                                },
                                {
                                    "id": 103,
                                    "name": "hustlecup.jpg",
                                    "url": "https://images.deliveryhero.io/image/fd-ph/LH/kmph-hero.jpg",
                                    "type": "image/jpg",
                                    "dimmension": "2000 x 2000",
                                    "size": "100400",
                                    "photo_by": "Admin"
                                },
                                {
                                    "id": 104,
                                    "name": "MS-Surface.jpg",
                                    "url": "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4OXzi?ver=3a58",
                                    "type": "image/jpg",
                                    "dimmension": "2000 x 2000",
                                    "size": "113200",
                                    "photo_by": "Admin"
                                },
                                {
                                    "id": 101,
                                    "name": "Famoustower.jpg",
                                    "url": "https://www.worldfamousthings.com/wp-content/uploads/2018/01/Leaning-Tower-of-Pisa-Italy.jpg",
                                    "type": "image/jpg",
                                    "dimmension": "2000 x 2000",
                                    "size": "763300",
                                    "photo_by": "Admin"
                                }
                            ]
                        },
                        {
                            "id": 20,
                            "name": "Document",
                            "children": []
                        },
                        {
                            "id": 30,
                            "name": "Videos",
                            "children": [{
                                    "id": 301,
                                    "name": "GODZILLA MINUS ONE Official Trailer",
                                    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png?20200912122019",
                                    "type": "video/mp4",
                                    "dimmension": "2000 x 2000",
                                    "size": "763300",
                                    "photo_by": "Admin"
                                },
                                {
                                    "id": 302,
                                    "name": "Marvel Studios’ Loki Season 2 | October 6 on Disney+",
                                    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png?20200912122019",
                                    "type": "video/mp4",
                                    "dimmension": "2000 x 2000",
                                    "size": "763300",
                                    "photo_by": "Admin"
                                },
                                {
                                    "id": 302,
                                    "name": "THE BOY AND THE HERON | Official Teaser Trailer",
                                    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png?20200912122019",
                                    "type": "video/mp4",
                                    "dimmension": "2000 x 2000",
                                    "size": "763300",
                                    "photo_by": "Admin"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": 2,
                    "name": "Sources",
                    "children": []
                },
                {
                    "id": 3,
                    "name": "Shared",
                    "children": []
                }
            ],
            allImage: [],
            mem: [],
            members: [
            ],
            checkedMember: null,
            keyword: null,
            totalPercent: 0,
            percent: 0
        }
    },
    mounted() {
        this.init();
        this.getAllImageToData(this.data[0]);
        const photoByValues = [];

        this.allImage.forEach((value, index) => {
            photoByValues.push({id: index+1, name: value.photo_by});
        });
        this.members = Array.from(new Set(photoByValues.map(user => user.name))).map(name => {
            const matchingUser = photoByValues.find(user => user.name === name);
            return { id: matchingUser.id, name: name, checked: false };
        });
        this.members.push({"id": 3, "name": 'All', "checked": true});
        this.members.reverse();
        this.totalPercentGB(this.allImage);
    },
    methods: {
        init() {
            var toggler = document.getElementsByClassName("caret");
            var i;

            for (i = 0; i < toggler.length; i++) {
                toggler[i].addEventListener("click", function () {
                    if (this.parentElement.querySelector(".nested")) {
                        this.parentElement.querySelector(".nested").classList.toggle("active");
                        this.classList.toggle("caret-down");
                    }
                });
            }
        },
        getImageToMember(member) {
            this.members.forEach((value, index) => {
                if (member.id !== value.id) {
                    value.checked = false;
                } else {
                    this.checkedMember = value.name;
                }
            });
            this.allImage = [];
            this.getAllImageToData(this.data[0], member.name, this.keyword);
        },
        a(a) {

        },
        getAllImageToData(data, nameMember = null, keyword) {
            if (data.url) {
                if (nameMember && data.photo_by == nameMember) {
                    this.allImage.push(data);
                }

                if (nameMember == null || nameMember == 'All') {
                    this.allImage.push(data);
                }
            }
            if (data.children && data.children.length > 0) {
                for(const child of data.children) {
                    this.getAllImageToData(child, nameMember, keyword);
                }
            }

            if (keyword) {
                this.allImage = this.allImage.filter(item => item.name.includes(keyword));
                return this.allImage;
            }
            return this.allImage;
        },
        getImageToFolder(dataFolder) {
            this.allImage = [];
            if (dataFolder.children) {
                console.log(this.checkedMember);
                this.getAllImageToData(dataFolder, this.checkedMember, this.keyword);
            }
        },
        searchImage() {
            this.allImage = this.allImage.filter(item => item.name.includes(this.keyword));
        },
        convertBytesToKilobytes(bytes) {
            const kilobytes = bytes / 1024;
            return kilobytes.toFixed(1);
        },
        totalPercentGB(data) {
            var totalSize = 0;
            data.forEach((value, index) => {
                totalSize += Number(value.size);
            });
            this.totalPercent = (this.convertBytesToKilobytes(totalSize)/(2 * 1024 * 1024))*100;
            this.percent = this.totalPercent*10
        }
    },
}
</script>

<style scoped>
body {
    font-size: 14px;
}

ul,
#myul {
    list-style-type: none;
}

#myul {
    margin: 0;
    padding: 0;
}

.caret {
    cursor: pointer;
    -webkit-user-select: none;
    /* Safari 3.1+ */
    -moz-user-select: none;
    /* Firefox 2+ */
    -ms-user-select: none;
    /* IE 10+ */
    user-select: none;
}

.caret::before {
    content: "\25B2";
    color: #222944;
    display: inline-block;
    margin-right: 6px;
    background: none !important;
    border: none !important;
}

.caret-down::before {
    -ms-transform: rotate(90deg);
    -webkit-transform: rotate(90deg);
}

.nested {
    display: none;
}

.active {
    display: block;
}

.fa-solid {
    color: #222944;
}

.progress-bar {
    width: 200px;
    height: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
    overflow: hidden;
}

.progress {
    height: 100%;
    background-color: #0d6efd;
    border-radius: 5px;
    transition: width 0.5s ease-in-out;
}

.percent {
    color: black;
}

img {
    box-shadow: 1px 2px 3px #ccc;
    -moz-box-shadow: 1px 2px 3px #ccc;
    -khtml-box-shadow: 1px 2px 3px #ccc;
    -webkit-box-shadow: 1px 2px 3px #ccc;
    width: 250px;
    height: 100px;
    border-radius: 10px;
}
a, th {
    color: #545658;
}
</style>
