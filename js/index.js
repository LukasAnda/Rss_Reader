window.onload = function () {
    loadPage()
};

function loadPage() {
    let url = document.getElementById("urlInput").value;
    jQuery("#feeds").empty();
    jQuery('#title').empty();
    const order = [
        document.querySelector("#orderSelect").value,
        document.querySelector("#fieldSelect").value
    ].filter(function (e) {
        return !!e;
    })
        .join("");

    const rss = new RSS(document.querySelector("#feeds"), url, {
        limit: 100,
        support: false,
        order: order,
        layoutTemplate: `<div>
                                <div class='card-group row'>{entries}</div>
                            </div>`,
        entryTemplate: `<div class="col-12 col-md-6 col-lg-4 col-xl-3 card-wrapper">
                            <div class="card">
                                {enclosure}
                                <div class="card-body">
                                    <h5 class="card-title">{title}</h5>
                                    <div class="card-subtitle">{author}</div>
                                    <div class="card-text">{shortBody}</div>
                                    <div style="height: 20px"></div>
                                    <a href="{url}" >
                                        <button class="btn btn-raised btn-primary" type="submit">Prejsť na článok</button>
                                    </a> 
                                </div>
                                <div class="card-footer">
                                    {formattedDate}
                                </div>
                                </div>
                            </div>`,
        dateFormat: "DD MM YYYY HH mm",
        dateLocale: "sk",
        tokens: {
            enclosure: function (entry, tokens) {
                if (entry.enclosure) {
                    return `<img class="card-img-top" src="${entry.enclosure.url}" />`;
                }
                return "";
            },
            pageTitle: function (entry, tokens) {
                if (entry.feed) {
                    return `<div style="text-align: center">JSON.parse(entry.feed)</div>`
                }
                return ""
            },
            formattedDate: function (entry, tokens) {
                if (tokens.date) {
                    return moment(tokens.date, "DD MM YYYY HH mm").locale("sk").fromNow()
                }
                return ""
            }
        }
    });
    rss.on('data', (data) => {
        console.log("SuCCESS");
        jQuery('#title').append(
            `<div class="title text-center">
                     <div class="h5">${data.feed.title}</div>
                     <div class="h6">${data.feed.description}</div>
                </div>`
        );
    }).render().then(
        ()=>{},
        (e) => {
            jQuery('#title').append(
                `<div class="title text-center">
                     <div class="h5">Táto URL neponúka ATOM feed.</div>
                     <div class="h6">Skontrolujte prosím jej správnosť a skúste to znova.</div>
                </div>`
            );
        }
    )
}