class Modal {
    modal;
    submit_res;

    // сборка
    constructor(data) {
        this.data = { // These are the defaults.
            classModal: '', // класс для модального окна
            idModal: '', // класс для модального окна
            mode: 'center', // center | top | right
            title: 'Заголовок окна',
            desc: '',
            content: '', // HTML-контент
            width: '', // задаем ширину окна "560" / " " (авто)
            esc: true, // закрыть по клавише ESC
            closeBackground: true, // закрыть по фону
            eventCloseModal:'',
            footerEvents:{
                cancel: {
                    active: true,
                    title: 'Отменить',
                    nameClass: '',
                    callback:'',
                    callback_params:{}
                },
                submit: {
                    active: true,
                    title: 'Готово',
                    nameClass: '',
                    callback:function(modalClass){
                    },
                    callback_params:{}
                }
            }
        };

        this.data = this.mergeJson(this.data, data);

        // сборка
        this.template();
        this.widthScrollBody();
        this.openModal();
        this.events();
    }
    
    
    template() {
        let widthModal = (this.data.width !== undefined && this.data.width !== '') ? 'style="width: '+this.data.width+'" ' : '',
            footerBtn = this.data.footerEvents,
            classModal = (this.data.classModal !== undefined && this.data.classModal != '') ? this.data.classModal : '',
            footerBtnCancel = (this.data.footerEvents.cancel != undefined && this.data.footerEvents.cancel.title !== undefined && this.data.footerEvents.cancel.title !== '') ? this.data.footerEvents.cancel.title : 'Cancel title',
            footerBtnSubmit = (this.data.footerEvents.submit.title !== undefined && this.data.footerEvents.submit.title !== '') ? this.data.footerEvents.submit.title : 'Submit title',
            footerBtnSubmitClass = (this.data.footerEvents.submit.nameClass !== undefined && this.data.footerEvents.submit.nameClass !== '') ? this.data.footerEvents.submit.nameClass : '';

        // template
        var idModal = Date.now();
        idModal = "modal_"+idModal;

        if(this.data.idModal!='') idModal = this.data.idModal;

        var modal = document.createElement("div");
        modal.classList.add("mr-modal");
        if (classModal !== "") modal.classList.add(classModal);
        modal.setAttribute("direction", this.data.mode);
        modal.setAttribute("data-id", idModal);
        modal.id = idModal;
        let html = `
        <div class="container-body" `+widthModal+`>
            <div class="modal-header">
                <div class="header-info">
                    <h3 class="title">`+this.data.title+`</h3>`;
                    if ( this.data.desc !== undefined && this.data.desc !== '' ) {
                        html += `<p class="desc">`+this.data.desc+`</p>`;
                    }
                    html += `
                </div>
                <button type="button" class="btn btn-close-modal"><i class="ph ph-x"></i></button>
            </div>
            
            <div class="modal-content"></div>`;
                if (footerBtn != undefined && Object.keys(footerBtn).length && (this.data.footerEvents.cancel.active == true || this.data.footerEvents.submit.active == true)) {
                    html += `<div class="modal-footer">`;
                    if (this.data.footerEvents.cancel.active == true) {
                        html += `<button class="btn btn-outline-primary cancel">`+footerBtnCancel+`</button>`;
                    }
                    if (this.data.footerEvents.submit.active == true) {
                        html += `<button class="btn btn-primary submit ${footerBtnSubmitClass}">`+footerBtnSubmit+`</button>`;
                    }
                    html += `
            </div>`;
            }
            html += `
        </div>`;
        modal.innerHTML = html;
        modal.querySelector(".modal-content").append(this.data.content);
        this.modal = modal;
        document.body.append(modal);
    }

    // инициализация
    openModal() {
        document.body.classList.add('no-scroll');

        requestAnimationFrame( () => {
            this.modal.classList.add('open');
        });
    }

    // события
    events() {

        // Закрыть модальное окно по крестику
        let btnCloseModal = this.modal.querySelector(".btn-close-modal");
        if (btnCloseModal !== null) {
            btnCloseModal.addEventListener("click", () => {
                this.closeModal();
            });
        }

        // Закрыть модальное окно по cancel
        let btnCancel = this.modal.querySelector(".modal-footer .cancel");
        if (btnCancel !== null) {
            btnCancel.addEventListener("click", () => {
                if(this.data.footerEvents.cancel.callback!=undefined && this.data.footerEvents.cancel.callback!=''){
                    this.data.footerEvents.cancel.callback(this, this.data.footerEvents.cancel.callback_params);
                }else{
                    this.closeModal();
                }
            });
        }

        // Закрыть модальное окно по фону
        this.modal.addEventListener('mouseup', (e) => {
            var wrapper = this.modal.querySelector('.container-body');
            if (!wrapper.contains(e.target) && this.data.closeBackground != false) {
                this.closeModal();
            }
        });

        // закрыть по esc
        document.addEventListener('keydown', (e) => {
            if (e.keyCode === 27 && document.querySelectorAll(".mr-modal").length > 0 && this.data.esc != false) {
                this.closeModal();
            }
        });

        let btnSubmit = this.modal.querySelector(".modal-footer .submit");
        if (this.data.footerEvents.submit.callback != undefined && btnSubmit !== null) {
            btnSubmit.addEventListener("click", () => {
                btnSubmit.classList.add("loading");
                setTimeout( () => {
                    this.submit_res = this.data.footerEvents.submit.callback(this, this.data.footerEvents.submit.callback_params);
                }, 500);
            });
        }
    }

    // закрыть функция
    closeModal() {
        var modalALL = document.querySelectorAll(".mr-modal"),
            lastElement = modalALL[modalALL.length - 1];

        if( lastElement.getAttribute("id") == this.modal.getAttribute('id')) {

            if(this.data.eventCloseModal!=''){
                this.data.eventCloseModal(this);
            }

            this.modal.classList.remove('open')
            this.modal.querySelector(".container-body").addEventListener('transitionend', function(e) {
                this.closest(".mr-modal").remove();

                if (document.querySelectorAll(".mr-modal").length == 0) {
                    document.body.classList.remove('no-scroll');
                }
            });
        }
    }

    widthScrollBody() {
        var windowFullScreen = window.innerWidth,
            windowWidthWithScroll = document.documentElement.scrollWidth,
            withScroll = (windowFullScreen - windowWidthWithScroll);

        document.documentElement.style.setProperty('--widthScrollBar', `${withScroll}px`);
    }

    mergeJson(json1, json2) {
        for(var i in json1){
            if(this.getType(json1[i]) == 'object'){
                for(var k in json1[i]){
                    if(this.getType(json1[i][k]) == 'object'){
                        for(var p in json1[i][k]){
                            if(json2[i]!=undefined && json2[i][k]!=undefined && json2[i][k][p] != undefined) json1[i][k][p] = json2[i][k][p];
                        }
                    }else{
                        if(json2[i] != undefined && json2[i][k] != undefined) json1[i][k] = json2[i][k];
                    }
                }
            }else{
                if(json2[i] != undefined) json1[i] = json2[i];
            }
        }
        return json1;
    }

    getType(p) {
        if (Array.isArray(p)) return 'array';
        else if (typeof p == 'string') return 'string';
        else if (p != null && typeof p == 'object') return 'object';
        else return 'other';
    }
}
