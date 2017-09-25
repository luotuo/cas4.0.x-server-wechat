package org.jasig.cas.authentication.handler;

import org.jasig.cas.authentication.handler.PasswordEncoder;

import javax.validation.constraints.NotNull;
import java.math.BigInteger;
import java.security.MessageDigest;

/**
 * Created by luotuo on 17-8-22.
 */
public class MyPasswordEncoder implements PasswordEncoder {
    @NotNull
    private final String encodingAlgorithm;

    private String characterEncoding;

    public MyPasswordEncoder(final String encodingAlgorithm) {
        this.encodingAlgorithm = encodingAlgorithm;
    }

    public String encode(final String password) {
        if (encodingAlgorithm.equals("0")) {
            // MD5
            return md5Alg(password);
        } else if (encodingAlgorithm.equals("1")) {
            // MD5 with salt
            return md5WithSaltAlg(password);
        } else {
            // clear text
            return clearText(password);
        }
    }

    private String clearText(final String password) {
        return password;
    }

    private String md5Alg(final String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            // 计算md5函数
            md.update(password.getBytes("UTF-8"));
            // digest()最后确定返回md5 hash值，返回值为8位字符串。因为md5 hash值是16位的hex值，实际上就是8位的字符
            // BigInteger函数则将8位的字符串转换成16位hex值，用字符串来表示；得到字符串形式的hash值
            return new BigInteger(1, md.digest()).toString(16);
        } catch (Exception e) {
            return password;
        }
    }

    private String md5WithSaltAlg(final String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            // 计算md5函数
            md.update(password.getBytes("UTF-8"));
            // digest()最后确定返回md5 hash值，返回值为8位字符串。因为md5 hash值是16位的hex值，实际上就是8位的字符
            // BigInteger函数则将8位的字符串转换成16位hex值，用字符串来表示；得到字符串形式的hash值
            return new BigInteger(1, md.digest()).toString(16);
        } catch (Exception e) {
            return password;
        }
    }
}
