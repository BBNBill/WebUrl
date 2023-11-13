import axios from "axios";
import { useState, useEffect } from "react";
import './App.css';
import Swal from 'sweetalert2';

function App() {
  const [url, setUrl] = useState([]);
  const [ownerurl, setOwnerurl] = useState();
  const [platform, setPlatform] = useState();
  const [nameurl, setNameurl] = useState();
  const [linkurl, setLinkurl] = useState();
  const [post, setPost] = useState('');
  const [friend, setFriend] = useState('');
  const [follow, setFollow] = useState('');
  const [id, setId] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchname, setSearchname] = useState('');
  const [searchurlname, setSearchurlname] = useState('');

  useEffect(() => {
    fetchData();
    fetchDataSelect();
  }, []);

  const fetchData = async () => {
    await axios.get("http://localhost:3000/testConnect").then((res) => {
      console.log(res.data);
    }).catch((err) => {
      console.log(err);
    });
  };

  const fetchDataSelect = async () => {
    try {
      await axios.get("http://localhost:3000/select").then((res) => {
        setUrl(res.data);
      }).catch((err) => {
        throw err.response.data;
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  const fetchDataInfo = async () => {
    try {
      await axios.get('http://localhost:3000/info/' + searchname + '/'+ searchurlname).then((res) => {
        setUrl(res.data);
      }).catch((err) => {
        throw err.response.data;
      });
    } catch (e) {
      console.log(e.message);
    }
  };


  const handleSave = async (e) => {
    e.preventDefault();
    if (!ownerurl || !platform || !nameurl || !linkurl) {
      Swal.fire({
        title: 'ผิดพลาด',
        text: 'กรุณาใส่ข้อมูลให้ครบ',
        icon: 'warning'
      })
      return;
    } else {
      try {
        const payload = {
          ownerurl: ownerurl,
          platform: platform,
          nameurl: nameurl,
          linkurl: linkurl,
          post: post,
          friend: friend,
          follow: follow
        };
        if (id === 0) {
          await axios.post('http://localhost:3000/insert', payload).then(res => {
            console.log(res.data);
            if (searchname === '') {
              fetchDataSelect();
            } else {
              fetchDataInfo();
            }
            setOwnerurl('');
            setNameurl('');
            setPlatform('');
            setLinkurl('');
            setPost('');
            setFriend('');
            setFollow('');
          }).catch(err => {
            throw err.response.data;
          })
        } else {
          payload.id = id;
          await axios.put('http://localhost:3000/update', payload).then(res => {
            if (searchname === '') {
              fetchDataSelect();
            } else {
              fetchDataInfo();
            }
            setId(0);
            setOwnerurl('');
            setNameurl('');
            setPlatform('');
            setLinkurl('');
            setPost('');
            setFriend('');
            setFollow('');
          }).catch(err => {
            throw err.response.data;
          })
        }
      } catch (e) {
        console.log(e.message);
      }
    }
  }
  const handleEdit = (item) => {
    setOwnerurl(item.ownerurl);
    setPlatform(item.platform);
    setNameurl(item.nameurl);
    setLinkurl(item.linkurl);
    setPost(item.post);
    setFriend(item.friend);
    setFollow(item.follow);
    setId(item.id);
  }

  const handelCall = (item) => {
    setOwnerurl(item.ownerurl);
    setPlatform(item.platform);
    setNameurl(item.nameurl);
    setLinkurl(item.linkurl);
    setPost(0);
    setFriend(0);
    setFollow(0);
    setId(0);
  }

  const handleDelete = (item) => {
    try {
      Swal.fire({
        title: 'Confirm Delete',
        text: 'Are you sure',
        icon: 'question',
        showCancelButton: true,
        showConfirmButton: true
      }).then(async res => {
        if (res.isConfirmed) {
          await axios.delete('http://localhost:3000/delete/' + item.id).then(res => {
            if (searchname === '') {
              fetchDataSelect();
            } else {
              fetchDataInfo();
            }
          }).catch(err => {
            throw err.response.data;
          })
        }
      })
    } catch (e) {
      console.log(e.message);
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchname === '') {
      try {
        await axios.get("http://localhost:3000/select").then((res) => {
          setUrl(res.data);
        }).catch((err) => {
          throw err.response.data;
        });
      } catch (e) {
        console.log(e.message);
      }
    } else {
      try {
        const response = await axios.get('http://localhost:3000/info/' + searchname + '/' + searchurlname);
        setUrl(response.data);
        /*const testdata = [response.data];
        const ax = testdata.includes(searchname) && testdata.includes('1023');*/

        const testdata = response.data;
        const ax = testdata.some(item => (item.ownerurl === searchname && item.post === '1023'));
        if (ax) {
          console.log("พบข้อมูลส่ง update");
          fetchDataInfo();
      } else {
          console.log("ไม่พบข้อมูลส่ง insert");
      }
      } catch (error) {
        console.error('Error searching employees:', error);
        Swal.fire({
          title: 'การค้นหาผิดพลาด',
          text: 'ไม่พบข้อมูลที่ค้นหา',
          icon: 'warning',
        });
        fetchDataSelect();
      }
    }
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(url.length / itemsPerPage);
  const slicedData = url.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="App container">
      <div className="mt-4">
        <h1>URL Manager</h1>
      </div>
      <form onSubmit={handleSearch} className="card">
        <div class="input-group">
          <label class="input-group-text">ค้นหาจากชื่อ</label>
          <input
            value={searchname}
            onChange={e => setSearchname(e.target.value)}
            className="form-control col-3"
          />
          <label class="input-group-text">ค้นหาจากบัญชี</label>
          <input
            value={searchurlname}
            onChange={e => setSearchurlname(e.target.value)}
            className="form-control col-3"
          />
          <button type="submit" className="btn btn-primary col-3">Search</button>
        </div>
      </form>

      <form onSubmit={handleSave} className="card mt-3">
        <div className="card-body">
          <div class="input-group">
            <label class="input-group-text">ยศ-ชื่อ-สกุล</label>
            <input value={ownerurl} onChange={e => setOwnerurl(e.target.value)} className="form-control" />
          </div>

          <div class="input-group mt-3">
            <label class="input-group-text" for="inputGroupSelect01">Platform</label>
            <select class="form-select col-1" id="inputGroupSelect01" value={platform} onChange={e => setPlatform(e.target.value)}>
              <option selected>Choose...</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="Tiktok">Tiktok</option>
              <option value="Twitter(X)">Twitter(X)</option>
            </select>
            <label className="input-group-text">ชื่อบัญชี</label>
            <input value={nameurl} onChange={e => setNameurl(e.target.value)} className="form-control" />
          </div>

          <div className="input-group">
            <label className="input-group-text mt-3">LinkURL</label>
            <input value={linkurl} onChange={e => setLinkurl(e.target.value)} className="form-control mt-3" />
          </div>

          <div className="input-group mt-3">
            <label className="input-group-text">จำนวนโพส</label>
            <input type="number" min="0" value={post} onChange={e => setPost(e.target.value)} className="form-control" />
            <label className="input-group-text">จำนวนเพื่อน</label>
            <input type="number" min="0" value={friend} onChange={e => setFriend(e.target.value)} className="form-control" />
            <label className="input-group-text">จำนวนผู้ติดตาม</label>
            <input type="number" min="0" value={follow} onChange={e => setFollow(e.target.value)} className="form-control" />
          </div>

          <div className="mt-3 text">
            <button onClick={handleSave} type="submit" className="btn btn-primary col-3">บันทึกข้อมูล</button>
          </div>
        </div>
      </form>

      <div className="card-body">
        <table className="table table-striped mt-3">
          <colgroup>
            <col style={{ width: '5%' }} /> {/* กำหนดความกว้างของคอลัมน์ ID */}
            <col style={{ width: '15%' }} /> {/* กำหนดความกว้างของคอลัมน์ ยศ-ชื่อ-สกุล */}
            <col style={{ width: '15%' }} /> {/* กำหนดความกว้างของคอลัมน์ ชื่อบัญชี */}
            <col style={{ width: '5%' }} /> {/* กำหนดความกว้างของคอลัมน์ Platform */}
            <col style={{ width: '30%' }} /> {/* กำหนดความกว้างของคอลัมน์ LinkURL */}
            <col style={{ width: '5%' }} /> {/* กำหนดความกว้างของคอลัมน์ จำนวนโพส */}
            <col style={{ width: '5%' }} /> {/* กำหนดความกว้างของคอลัมน์ จำนวนเพื่อน */}
            <col style={{ width: '5%' }} /> {/* กำหนดความกว้างของคอลัมน์ จำนวนผู้ติดตาม */}
            <col style={{ width: '20%' }} /> {/* กำหนดความกว้างของคอลัมน์ ดำเนินการ */}
          </colgroup>
          <thead>
            <tr className="table-success">
              <th>ID</th>
              <th className="text-start">ยศ-ชื่อ-สกุล</th>
              <th className="text-start">ชื่อบัญชี</th>
              <th className="text-start">Platform</th>
              <th className="text-center">LinkURL</th>
              <th className="text-start">Post</th>
              <th className="text-start">friend</th>
              <th className="text-start">follow</th>
              <th className="text-center">ดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {slicedData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td className="text-start">{item.ownerurl}</td>
                <td className="text-start">{item.nameurl}</td>
                <td className="text-start">{item.platform}</td>
                <td className="text-center"><a href={item.linkurl}>{item.linkurl}</a></td>
                <td className="text-center">{item.post}</td>
                <td className="text-center">{item.friend}</td>
                <td className="text-center">{item.follow}</td>
                <td>
                  <button onClick={e => handleEdit(item)} className="btn btn-success btn-sm me-2">Edit</button>
                  <button onClick={e => handleDelete(item)} className="btn btn-danger btn-sm me-2">Delete</button>
                  <button onClick={e => handelCall(item)} className="btn btn-danger btn-sm">Call</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination-container">
          <button type="button" class="btn btn-danger" style={{ width: '100px', height: '40px', marginRight: '10px' }} onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
          <span className="crimson-text">Page {currentPage} of {totalPages}  </span>
          <button type="button" class="btn btn-success" style={{ width: '100px', height: '40px', marginRight: '10px' }} onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default App;
