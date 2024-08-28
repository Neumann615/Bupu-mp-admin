import moment from 'moment';
/**
 * 使用超链接进行下载
 * @param url
 * @param filename
 */
export function downloadByPost(url: string, options: Record<string, any>, filename?: string) {
    const { extension = 'xlsx', ...rest } = options;
    return new Promise<boolean>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        // xhr.setRequestHeader('Content-Type', 'multipart/form-data');
        xhr.responseType = 'blob';
        xhr.onload = function () {
            // 请求完成
            if (this.status === 200) {
                resolve(true);
                // 返回200
                const blob = this.response;
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onerror = function (e) {
                    reject(e);
                };
                reader.onload = function (e) {
                    // 转换完成，创建一个a标签用于下载
                    const a = document.createElement('a');
                    a.download = filename || `result-${moment().format('YYYY-MM-D')}.${extension}`;
                    // @ts-ignore
                    a.href = e.target.result;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                };
                return;
            }
            reject(new Error('request status is ' + this.status + ':' + this.statusText));
        };
        // 发送ajax请求
        const formData = new FormData();
        Object.entries({ ...rest, extension }).forEach(([k, v]) => {
            formData.append(k, v);
        });
        xhr.send(formData);
    });
}
